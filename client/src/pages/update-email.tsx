import { Router } from '@gatsbyjs/reach-router';
import { withPrefix } from 'gatsby';
import React from 'react';

import ShowUpdateEmail from '../client-only-routes/show-update-email';
import RedirectHome from '../components/redirect-home';

function UpdateEmail(): JSX.Element {
  return (
    <Router>
      <ShowUpdateEmail path={withPrefix('/update-email')} />

      <RedirectHome default />
    </Router>
  );
}

UpdateEmail.displayName = 'UpdateEmail';

export default UpdateEmail;
