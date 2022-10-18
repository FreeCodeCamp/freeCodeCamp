import React, { ReactNode, useEffect } from 'react';
import sha1 from 'sha-1';
import {
  FeatureDefinition,
  GrowthBook,
  GrowthBookProvider
} from '@growthbook/growthbook-react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { isSignedInSelector, userSelector } from '../../redux/selectors';
import envData from '../../../../config/env.json';
import { User } from '../../redux/prop-types';

const { clientLocale, growthbookUri } = envData as {
  clientLocale: string;
  growthbookUri: string | null;
};

const growthbook = new GrowthBook();

const mapStateToProps = createSelector(
  isSignedInSelector,
  userSelector,
  (isSignedIn, user: User) => ({
    isSignedIn,
    user
  })
);

type StateProps = ReturnType<typeof mapStateToProps>;
interface GrowthBookWrapper extends StateProps {
  children: ReactNode;
}

const GrowthBookWrapper = ({
  children,
  isSignedIn,
  user
}: GrowthBookWrapper) => {
  useEffect(() => {
    async function initGrowthBook() {
      if (!growthbookUri) return;

      if (isSignedIn) {
        const { joinDate, completedChallenges } = user;
        growthbook.setAttributes({
          id: sha1(user.email),
          staff: user.email.includes('@freecodecamp'),
          clientLocal: clientLocale,
          joinDateUnix: Date.parse(joinDate),
          completedChallengesLength: completedChallenges.length
        });
      }

      try {
        const res = await fetch(growthbookUri);
        const data = (await res.json()) as {
          features: Record<string, FeatureDefinition>;
        };
        growthbook.setFeatures(data.features);
      } catch (e) {
        // TODO: report to sentry when it's enabled
        console.error(e);
      }
    }

    void initGrowthBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, growthbookUri]);

  return (
    <GrowthBookProvider growthbook={growthbook}>{children}</GrowthBookProvider>
  );
};

export default connect(mapStateToProps)(GrowthBookWrapper);
