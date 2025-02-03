import { Router } from '@gatsbyjs/reach-router';
import { withPrefix } from 'gatsby';
import React from 'react';

/* eslint-disable max-len */
import ShowProfileOrFourOhFour from '../client-only-routes/show-profile-or-four-oh-four';
import FourOhFour from '../components/FourOhFour';
/* eslint-enable max-len */

function FourOhFourPage(): JSX.Element {
  return (
    <Router>
      {/* Error from installing @types/react-helmet and @types/react-redux */}
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <ShowProfileOrFourOhFour path={withPrefix('/:maybeUser')} />

      <FourOhFour default />
    </Router>
  );
}

FourOhFourPage.displayName = 'FourOhFourPage';

export default FourOhFourPage;
