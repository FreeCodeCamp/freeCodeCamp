/* eslint-disable filenames-simple/naming-convention */

import { Router } from '@reach/router';
import { withPrefix } from 'gatsby';
import React from 'react';

import '../../certification.css';
import ShowCertification from '../../../client-only-routes/show-certification';
import RedirectHome from '../../../components/redirect-home';

function Certification(): JSX.Element {
  return (
    <Router>
      <ShowCertification
        // Error from installing @types/react-helmet and @types/react-redux
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        path={withPrefix('/certification/:username/:certSlug')}
      />

      <RedirectHome default />
    </Router>
  );
}

export default Certification;
