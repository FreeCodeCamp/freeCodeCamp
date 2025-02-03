import {
  createHistory,
  createMemorySource,
  LocationProvider
} from '@gatsbyjs/reach-router';
import { render } from '@testing-library/react';
import { navigate, withPrefix } from 'gatsby';
import React from 'react';

import Challenges from './challenges';

describe('Challenges', () => {
  // Source: https://testing-library.com/docs/example-reach-router/
  function renderWithRouterWrapper({
    route = '/',
    history = createHistory(createMemorySource(route))
  } = {}) {
    return {
      ...render(
        <LocationProvider history={history}>
          <Challenges />
        </LocationProvider>
      ),
      // adding `history` to the returned utilities to allow us
      // to reference it in our tests (just try to avoid using
      // this to test implementation details).
      history
    };
  }

  const challenges = withPrefix('/challenges');
  const learn = withPrefix('/learn');

  it('should handle redirect to /learn', () => {
    renderWithRouterWrapper({ route: challenges });

    expect(navigate).toHaveBeenLastCalledWith(learn);
  });

  it('should handle redirect to /learn/:super-block', () => {
    renderWithRouterWrapper({ route: `${challenges}/super-block` });

    expect(navigate).toHaveBeenLastCalledWith(`${learn}/super-block`);
  });

  it('should handle redirect to /learn/:super-block/:block', () => {
    renderWithRouterWrapper({ route: `${challenges}/super-block/block` });

    expect(navigate).toHaveBeenLastCalledWith(`${learn}/super-block/block`);
  });

  it('should handle redirect to /learn/:super-block/:block/:challenge', () => {
    renderWithRouterWrapper({
      route: `${challenges}/super-block/block/challenge`
    });

    expect(navigate).toHaveBeenLastCalledWith(
      `${learn}/super-block/block/challenge`
    );
  });
});
