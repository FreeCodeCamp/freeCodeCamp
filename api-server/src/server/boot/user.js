import debugFactory from 'debug';
import dedent from 'dedent';
import { body } from 'express-validator';
import { pick } from 'lodash';
import { Observable } from 'rx';

import {
  fixCompletedChallengeItem,
  fixPartiallyCompletedChallengeItem
} from '../../common/utils';
import { removeCookies } from '../utils/getSetAccessToken';
import { ifNoUser401, ifNoUserRedirectHome } from '../utils/middleware';
import {
  getProgress,
  normaliseUserFields,
  userPropsForSession
} from '../utils/publicUserProps';
import { getRedirectParams } from '../utils/redirection';
import { trimTags } from '../utils/validators';
import { createDeleteWebhookToken } from '../middlewares/delete-webhook-token';

const log = debugFactory('fcc:boot:user');
const sendNonUserToHome = ifNoUserRedirectHome();

function bootUser(app) {
  const api = app.loopback.Router();

  const getSessionUser = createReadSessionUser(app);
  const postReportUserProfile = createPostReportUserProfile(app);
  const postDeleteAccount = createPostDeleteAccount(app);
  const postWebhookToken = createPostWebhookToken(app);
  const deleteWebhookToken = createDeleteWebhookToken(app);

  api.get('/account', sendNonUserToHome, getAccount);
  api.get('/account/unlink/:social', sendNonUserToHome, getUnlinkSocial);
  api.get('/user/get-session-user', getSessionUser);
  api.post(
    '/account/delete',
    ifNoUser401,
    deleteWebhookToken,
    postDeleteAccount
  );
  api.post(
    '/account/reset-progress',
    ifNoUser401,
    deleteWebhookToken,
    postResetProgress
  );
  api.post(
    '/user/report-user/',
    ifNoUser401,
    body('reportDescription').customSanitizer(trimTags),
    postReportUserProfile
  );

  api.post('/user/webhook-token', ifNoUser401, postWebhookToken);
  api.delete(
    '/user/webhook-token',
    ifNoUser401,
    deleteWebhookToken,
    deleteWebhookTokenResponse
  );

  app.use(api);
}

function createPostWebhookToken(app) {
  const { WebhookToken } = app.models;

  return async function postWebhookToken(req, res) {
    const ttl = 900 * 24 * 60 * 60 * 1000;
    let newToken;

    try {
      await WebhookToken.destroyAll({ userId: req.user.id });
      newToken = await WebhookToken.create({ ttl, userId: req.user.id });
    } catch (e) {
      return res.status(500).send('Error starting project');
    }

    return res.json({ token: newToken?.id });
  };
}

function deleteWebhookTokenResponse(req, res) {
  if (!req.webhookTokenDeleted) {
    return res.status(500).send('Error deleting token');
  }

  return res.send({ token: null });
}

function createReadSessionUser(app) {
  const { Donation } = app.models;

  return async function getSessionUser(req, res, next) {
    const queryUser = req.user;

    const webhookTokenArr = await queryUser.webhookTokens({
      userId: queryUser.id
    });
    const webhookToken = webhookTokenArr[0]?.id;

    const source =
      queryUser &&
      Observable.forkJoin(
        queryUser.getCompletedChallenges$(),
        queryUser.getPartiallyCompletedChallenges$(),
        queryUser.getPoints$(),
        Donation.getCurrentActiveDonationCount$(),
        (
          completedChallenges,
          partiallyCompletedChallenges,
          progressTimestamps,
          activeDonations
        ) => ({
          activeDonations,
          completedChallenges,
          partiallyCompletedChallenges,
          progress: getProgress(progressTimestamps, queryUser.timezone)
        })
      );
    Observable.if(
      () => !queryUser,
      Observable.of({ user: {}, result: '' }),
      Observable.defer(() => source)
        .map(
          ({
            activeDonations,
            completedChallenges,
            partiallyCompletedChallenges,
            progress
          }) => ({
            user: {
              ...queryUser.toJSON(),
              ...progress,
              completedChallenges: completedChallenges.map(
                fixCompletedChallengeItem
              ),
              partiallyCompletedChallenges: partiallyCompletedChallenges.map(
                fixPartiallyCompletedChallengeItem
              )
            },
            sessionMeta: { activeDonations }
          })
        )
        .map(({ user, sessionMeta }) => ({
          user: {
            [user.username]: {
              ...pick(user, userPropsForSession),
              username: user.usernameDisplay || user.username,
              isEmailVerified: !!user.emailVerified,
              isGithub: !!user.githubProfile,
              isLinkedIn: !!user.linkedin,
              isTwitter: !!user.twitter,
              isWebsite: !!user.website,
              ...normaliseUserFields(user),
              joinDate: user.id.getTimestamp(),
              webhookToken
            }
          },
          sessionMeta,
          result: user.username
        }))
    ).subscribe(user => res.json(user), next);
  };
}

function getAccount(req, res) {
  const { username } = req.user;
  return res.redirect('/' + username);
}

function getUnlinkSocial(req, res, next) {
  const { user } = req;
  const { username } = user;
  const { origin } = getRedirectParams(req);
  let social = req.params.social;
  if (!social) {
    req.flash('danger', 'No social account found');
    return res.redirect('/' + username);
  }

  social = social.toLowerCase();
  const validSocialAccounts = ['twitter', 'linkedin'];
  if (validSocialAccounts.indexOf(social) === -1) {
    req.flash('danger', 'Invalid social account');
    return res.redirect('/' + username);
  }

  if (!user[social]) {
    req.flash('danger', `No ${social} account associated`);
    return res.redirect('/' + username);
  }

  const query = {
    where: {
      provider: social
    }
  };

  return user.identities(query, function (err, identities) {
    if (err) {
      return next(err);
    }

    // assumed user identity is unique by provider
    let identity = identities.shift();
    if (!identity) {
      req.flash('danger', 'No social account found');
      return res.redirect('/' + username);
    }

    return identity.destroy(function (err) {
      if (err) {
        return next(err);
      }

      const updateData = { [social]: null };

      return user.updateAttributes(updateData, err => {
        if (err) {
          return next(err);
        }
        log(`${social} has been unlinked successfully`);

        req.flash('info', `You've successfully unlinked your ${social}.`);
        return res.redirectWithFlash(`${origin}/${username}`);
      });
    });
  });
}

function postResetProgress(req, res, next) {
  const { user } = req;
  return user.updateAttributes(
    {
      progressTimestamps: [Date.now()],
      currentChallengeId: '',
      isRespWebDesignCert: false,
      is2018DataVisCert: false,
      isFrontEndLibsCert: false,
      isJsAlgoDataStructCert: false,
      isApisMicroservicesCert: false,
      isInfosecQaCert: false,
      isQaCertV7: false,
      isInfosecCertV7: false,
      is2018FullStackCert: false,
      isFrontEndCert: false,
      isBackEndCert: false,
      isDataVisCert: false,
      isFullStackCert: false,
      isSciCompPyCertV7: false,
      isDataAnalysisPyCertV7: false,
      isMachineLearningPyCertV7: false,
      isRelationalDatabaseCertV8: false,
      completedChallenges: []
    },
    function (err) {
      if (err) {
        return next(err);
      }
      return res.status(200).json({});
    }
  );
}

function createPostDeleteAccount(app) {
  const { User } = app.models;
  return async function postDeleteAccount(req, res, next) {
    return User.destroyById(req.user.id, function (err) {
      if (err) {
        return next(err);
      }
      req.logout();
      removeCookies(req, res);
      return res.status(200).json({});
    });
  };
}

function createPostReportUserProfile(app) {
  const { Email } = app.models;
  return function postReportUserProfile(req, res, next) {
    const { user } = req;
    const { username, reportDescription: report } = req.body;
    const { origin } = getRedirectParams(req);
    log(username);
    log(report);

    if (!username || !report || report === '') {
      return res.json({
        type: 'danger',
        message: 'flash.provide-username'
      });
    }
    return Email.send$(
      {
        type: 'email',
        to: 'support@freecodecamp.org',
        cc: user.email,
        from: 'team@freecodecamp.org',
        subject: `Abuse Report : Reporting ${username}'s profile.`,
        text: dedent(`
        Hello Team,\n
        This is to report the profile of ${username}.\n
        Report Details:\n
        ${report}\n\n
        Reported by:
        Username: ${user.username}
        Name: ${user.name}
        Email: ${user.email}\n
        Thanks and regards,
        ${user.name}
      `)
      },
      err => {
        if (err) {
          err.redirectTo = `${origin}/${username}`;
          return next(err);
        }

        return res.json({
          type: 'info',
          message: 'flash.report-sent',
          variables: { email: user.email }
        });
      }
    );
  };
}
export default bootUser;
