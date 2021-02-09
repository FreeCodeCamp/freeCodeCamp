/* eslint-disable react/jsx-sort-props */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import format from 'date-fns/format';
import { Grid, Row, Col, Image, Button } from '@freecodecamp/react-bootstrap';

import ShowProjectLinks from './ShowProjectLinks';
import FreeCodeCampLogo from '../assets/icons/FreeCodeCampLogo';
// eslint-disable-next-line max-len
import DonateForm from '../components/Donation/DonateForm';
import { Trans, useTranslation } from 'react-i18next';

import {
  showCertSelector,
  showCertFetchStateSelector,
  showCert,
  userFetchStateSelector,
  usernameSelector,
  isDonatingSelector,
  executeGA,
  userByNameSelector,
  fetchProfileForUser
} from '../redux';
import { createFlashMessage } from '../components/Flash/redux';
import standardErrorMessage from '../utils/standardErrorMessage';
import reallyWeirdErrorMessage from '../utils/reallyWeirdErrorMessage';

import RedirectHome from '../components/RedirectHome';
import { Loader, Spacer } from '../components/helpers';
import { isEmpty } from 'lodash';

const propTypes = {
  cert: PropTypes.shape({
    username: PropTypes.string,
    name: PropTypes.string,
    certName: PropTypes.string,
    certTitle: PropTypes.string,
    completionTime: PropTypes.number,
    date: PropTypes.number
  }),
  certDashedName: PropTypes.string,
  certName: PropTypes.string,
  createFlashMessage: PropTypes.func.isRequired,
  executeGA: PropTypes.func,
  fetchProfileForUser: PropTypes.func,
  fetchState: PropTypes.shape({
    pending: PropTypes.bool,
    complete: PropTypes.bool,
    errored: PropTypes.bool
  }),
  isDonating: PropTypes.bool,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }),
  showCert: PropTypes.func.isRequired,
  signedInUserName: PropTypes.string,
  user: PropTypes.shape({
    completedChallenges: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        solution: PropTypes.string,
        githubLink: PropTypes.string,
        files: PropTypes.arrayOf(
          PropTypes.shape({
            contents: PropTypes.string,
            ext: PropTypes.string,
            key: PropTypes.string,
            name: PropTypes.string,
            path: PropTypes.string
          })
        )
      })
    ),
    profileUI: PropTypes.shape({
      showName: PropTypes.bool
    }),
    username: PropTypes.string
  }),
  userFetchState: PropTypes.shape({
    complete: PropTypes.bool
  }),
  userFullName: PropTypes.string,
  username: PropTypes.string,
  validCertNames: PropTypes.arrayOf(PropTypes.string)
};

const requestedUserSelector = (state, { username = '' }) =>
  userByNameSelector(username.toLowerCase())(state);

const mapStateToProps = () => {
  return createSelector(
    showCertSelector,
    showCertFetchStateSelector,
    usernameSelector,
    userFetchStateSelector,
    isDonatingSelector,
    requestedUserSelector,
    (cert, fetchState, signedInUserName, userFetchState, isDonating, user) => ({
      cert,
      fetchState,
      signedInUserName,
      userFetchState,
      isDonating,
      user
    })
  );
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { createFlashMessage, showCert, fetchProfileForUser, executeGA },
    dispatch
  );

const ShowCertification = props => {
  const { t } = useTranslation();
  const [isDonationSubmitted, setIsDonationSubmitted] = useState(false);
  const [isDonationDisplayed, setIsDonationDisplayed] = useState(false);
  const [isDonationClosed, setIsDonationClosed] = useState(false);

  useEffect(() => {
    const { username, certName, validCertNames, showCert } = props;
    console.log(props);
    if (validCertNames.some(name => name === certName)) {
      showCert({ username, certName });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const {
      userFetchState: { complete: userComplete },
      signedInUserName,
      isDonating,
      cert: { username = '' },
      fetchProfileForUser,
      user,
      executeGA
    } = props;

    if (!signedInUserName || signedInUserName !== username) {
      if (isEmpty(user) && username) {
        fetchProfileForUser(username);
      }
    }

    if (
      !isDonationDisplayed &&
      userComplete &&
      signedInUserName &&
      signedInUserName === username &&
      !isDonating
    ) {
      setIsDonationDisplayed(true);

      executeGA({
        type: 'event',
        data: {
          category: 'Donation View',
          action: 'Displayed Certificate Donation',
          nonInteraction: true
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isDonationDisplayed,
    props.userFetchState,
    props.signedInUserName,
    props.isDonating,
    props.cert,
    props.executeGA
  ]);

  const hideDonationSection = () => {
    setIsDonationDisplayed(false);
    setIsDonationClosed(true);
  };

  const handleProcessing = (
    duration,
    amount,
    action = 'stripe form submission'
  ) => {
    props.executeGA({
      type: 'event',
      data: {
        category: 'Donation',
        action: `certificate ${action}`,
        label: duration,
        value: amount
      }
    });
    setIsDonationSubmitted(true);
  };

  const {
    cert,
    fetchState,
    validCertNames,
    certName,
    createFlashMessage,
    signedInUserName,
    location: { pathname }
  } = props;
  console.log(validCertNames, certName);
  if (!validCertNames.some(name => name === certName)) {
    createFlashMessage(standardErrorMessage);
    return <RedirectHome />;
  }

  const { pending, complete, errored } = fetchState;

  if (pending) {
    return <Loader fullScreen={true} />;
  }

  if (!pending && errored) {
    createFlashMessage(standardErrorMessage);
    return <RedirectHome />;
  }

  if (!pending && !complete && !errored) {
    createFlashMessage(reallyWeirdErrorMessage);
    return <RedirectHome />;
  }

  const {
    date,
    name: userFullName = null,
    username,
    certTitle,
    completionTime
  } = cert;

  const { user } = props;

  const displayName = userFullName ?? username;

  const certDate = new Date(date);
  const certYear = certDate.getFullYear();
  const certMonth = certDate.getMonth();
  const certURL = `https://freecodecamp.org${pathname}`;

  const donationCloseBtn = (
    <div>
      <Button
        block={true}
        bsSize='sm'
        bsStyle='primary'
        onClick={hideDonationSection}
      >
        {t('buttons.close')}
      </Button>
    </div>
  );

  let donationSection = (
    <Grid className='donation-section'>
      {!isDonationSubmitted && (
        <Row>
          <Col lg={8} lgOffset={2} sm={10} smOffset={1} xs={12}>
            <p>{t('donate.only-you')}</p>
          </Col>
        </Row>
      )}
      <DonateForm
        handleProcessing={handleProcessing}
        defaultTheme='light'
        isMinimalForm={true}
      />
      <Row>
        <Col sm={4} smOffset={4} xs={6} xsOffset={3}>
          {isDonationSubmitted && donationCloseBtn}
        </Col>
      </Row>
    </Grid>
  );

  const shareCertBtns = (
    <Row className='text-center'>
      <Spacer size={2} />
      <Button
        block={true}
        bsSize='lg'
        bsStyle='primary'
        target='_blank'
        href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${certTitle}&organizationId=4831032&issueYear=${certYear}&issueMonth=${certMonth +
          1}&certUrl=${certURL}`}
      >
        {t('profile.add-linkedin')}
      </Button>
      <Spacer />
      <Button
        block={true}
        bsSize='lg'
        bsStyle='primary'
        target='_blank'
        href={`https://twitter.com/intent/tweet?text=${t('profile.tweet', {
          certTitle: certTitle,
          certURL: certURL
        })}`}
      >
        {t('profile.add-twitter')}
      </Button>
    </Row>
  );

  return (
    <div className='certificate-outer-wrapper'>
      {isDonationDisplayed && !isDonationClosed ? donationSection : ''}
      <Grid className='certificate-wrapper certification-namespace'>
        <Row>
          <header>
            <Col md={5} sm={12}>
              <div className='logo'>
                <FreeCodeCampLogo />
              </div>
            </Col>
            <Col md={7} sm={12}>
              <div data-cy='issue-date' className='issue-date'>
                {t('certification.issued')}&nbsp;
                <strong>{format(certDate, 'MMMM d, y')}</strong>
              </div>
            </Col>
          </header>

          <main className='information'>
            <div className='information-container'>
              <Trans
                user={displayName}
                title={certTitle}
                time={completionTime}
                i18nKey='certification.fulltext'
              >
                <h3>placeholder</h3>
                <h1>
                  <strong>{{ user: displayName }}</strong>
                </h1>
                <h3>placeholder</h3>
                <h1>
                  <strong>{{ title: certTitle }}</strong>
                </h1>
                <h4>{{ time: completionTime }}</h4>
              </Trans>
            </div>
          </main>
          <footer>
            <div className='row signatures'>
              <Image
                alt="Quincy Larson's Signature"
                src={
                  'https://cdn.freecodecamp.org' +
                  '/platform/english/images/quincy-larson-signature.svg'
                }
              />
              <p>
                <strong>Quincy Larson</strong>
              </p>
              <p>{t('certification.executive')}</p>
            </div>
            <Row>
              <p className='verify'>
                {t('certification.verify', { certURL: certURL })}
              </p>
            </Row>
          </footer>
        </Row>
      </Grid>
      {signedInUserName === username ? shareCertBtns : ''}
      <Spacer size={2} />
      <ShowProjectLinks user={user} name={displayName} certName={certTitle} />
    </div>
  );
};

ShowCertification.displayName = 'ShowCertification';
ShowCertification.propTypes = propTypes;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowCertification);
// )(React.memo(ShowCertification, propComparator));
