import { Location } from '@gatsbyjs/reach-router';
import type { WindowLocation } from '@gatsbyjs/reach-router';
import type { SearchOptions } from 'instantsearch.js';
import algoliasearch from 'algoliasearch/lite';
import React, { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { createSelector } from 'reselect';
import { Configure, InstantSearch } from 'react-instantsearch';
import { algoliaAppId, algoliaAPIKey } from '../../../config/env.json';
import { newsIndex } from '../../utils/algolia-locale-setup';

import {
  isSearchDropdownEnabledSelector,
  searchQuerySelector,
  toggleSearchDropdown,
  updateSearchQuery
} from './redux';

// If a key is missing, searches will fail, but the client will still render.
const searchClient =
  algoliaAppId && algoliaAPIKey
    ? algoliasearch(algoliaAppId, algoliaAPIKey)
    : {
        // When Algolia is not configured, the client will still render,
        // the result query is returned to the search component as a mock
        //(mainly for testing without relying on Playwright fuffill route as
        // there is no request made without a key).
        search: (
          request: Array<{ indexName: string; params: SearchOptions }>
        ) => {
          return Promise.resolve({
            results: [
              {
                hits: [],
                query: request[0].params?.query === 'test' ? 'test' : '',
                params:
                  'highlightPostTag=__%2Fais-highlight__&highlightPreTag=__ais-highlight__&hitsPerPage=5&query=sdefpuhsdfpiouhdsfgp',
                index: 'news'
              }
            ]
          });
        }
      };

const mapStateToProps = createSelector(
  searchQuerySelector,
  isSearchDropdownEnabledSelector,
  function (
    query: string,
    isDropdownEnabled: boolean
  ): { query: string; isDropdownEnabled: boolean } {
    return { query, isDropdownEnabled };
  }
);
const mapDispatchToProps = {
  toggleSearchDropdown,
  updateSearchQuery
};

interface InstantSearchRootProps {
  isDropdownEnabled: boolean;
  location: WindowLocation;
  query: string;
  toggleSearchDropdown: (toggle: boolean) => void;
  updateSearchQuery: (query: string) => void;
  children: ReactNode;
}
function InstantSearchRoot({
  isDropdownEnabled,
  location,
  query,
  toggleSearchDropdown,
  updateSearchQuery,
  children
}: InstantSearchRootProps) {
  const isSmallHeight = useMediaQuery({
    query: `(min-height: 768px)`
  });

  // https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
  const prevLocationRef = useRef<InstantSearchRootProps['location']>();
  useEffect(() => {
    prevLocationRef.current = location;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prevLocation = prevLocationRef.current;
  useEffect(() => {
    if (!isDropdownEnabled) {
      toggleSearchDropdown(true);
    }

    if (location !== prevLocation) {
      updateSearchQuery('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const propsQuery = query;
  function onSearchStateChange(query: string | undefined): void {
    if (propsQuery === query) {
      return;
    }
    updateSearchQuery(query ?? '');
  }

  const hitsPerPage = isSmallHeight ? 8 : 5;
  return (
    <InstantSearch
      indexName={newsIndex}
      onStateChange={({ uiState }) => {
        onSearchStateChange(uiState.news?.query);
      }}
      searchClient={searchClient}
    >
      <Configure hitsPerPage={hitsPerPage} query={propsQuery} />
      {children}
    </InstantSearch>
  );
}

InstantSearchRoot.displayName = 'InstantSearchRoot';

const InstantSearchRootConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(InstantSearchRoot);

interface WithInstantSearchProps {
  children: ReactNode;
}
function WithInstantSearch({ children }: WithInstantSearchProps): JSX.Element {
  return (
    <Location>
      {({ location }) => (
        <InstantSearchRootConnected location={location}>
          {children}
        </InstantSearchRootConnected>
      )}
    </Location>
  );
}

WithInstantSearch.displayName = 'WithInstantSearch';

export default WithInstantSearch;
