import { Router } from '@gatsbyjs/reach-router';
import { withPrefix } from 'gatsby';
import React from 'react';

import ShowSettings from '../client-only-routes/show-settings';
import RedirectHome from '../components/redirect-home';

function Settings(): JSX.Element {
  return (
    <Router>
      <ShowSettings path={withPrefix('/settings')} />

      <RedirectHome default />
    </Router>
  );
}

Settings.displayName = 'Settings';

export default Settings;
