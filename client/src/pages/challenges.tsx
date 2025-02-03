// This exists purely to redirect legacy challenge paths to /learn that could
// exist in the web (posts, url shares, etc).

import { Router, RouteComponentProps } from '@gatsbyjs/reach-router';
import { navigate, withPrefix } from 'gatsby';
import React from 'react';

import toLearnPath from '../utils/to-learn-path';

type RouteComponentPropsExtended = RouteComponentProps & {
  block?: string;
  challenge?: string;
  superBlock?: string;
};

function Redirect(props: RouteComponentPropsExtended): null {
  if (typeof window !== 'undefined') {
    void navigate(toLearnPath(props));
  }

  return null;
}

function Challenges(): JSX.Element {
  return (
    <Router basepath={withPrefix('/challenges')}>
      <Redirect path='/:superBlock/' />
      <Redirect path='/:superBlock/:block/' />
      <Redirect path='/:superBlock/:block/:challenge' />
      <Redirect default={true} />
    </Router>
  );
}

Challenges.displayName = 'Challenges';

export default Challenges;
