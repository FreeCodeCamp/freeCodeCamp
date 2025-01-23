import type { RouteComponentProps } from '@gatsbyjs/reach-router';
import React from 'react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Container, Panel, Button, Spacer } from '@freecodecamp/ui';

import envData from '../../config/env.json';
import FullWidthRow from '../components/helpers/full-width-row';

const { apiLocation } = envData;

type ShowUnsubscribedProps = Pick<RouteComponentProps, 'path'> & {
  unsubscribeId?: string;
};

function ShowUnsubscribed({
  unsubscribeId
}: ShowUnsubscribedProps): JSX.Element {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t('metaTags:youre-unsubscribed')} | freeCodeCamp.org</title>
      </Helmet>
      <Container>
        <main>
          <FullWidthRow>
            <Spacer size='l' />
            <Panel variant='primary' className='text-center'>
              <Spacer size='m' />
              <h2 data-playwright-test-label='main-heading'>
                {t('misc.unsubscribed')}
              </h2>
              <p data-playwright-test-label='motivation-text'>
                {t('misc.keep-coding')}
              </p>
            </Panel>
          </FullWidthRow>
          {unsubscribeId ? (
            <FullWidthRow>
              <Button
                block={true}
                size='large'
                variant='primary'
                href={`${apiLocation}/resubscribe/${unsubscribeId}`}
              >
                {t('buttons.resubscribe')}
              </Button>
            </FullWidthRow>
          ) : null}
          <Spacer size='l' />
        </main>
      </Container>
    </>
  );
}

ShowUnsubscribed.displayName = 'ShowUnsubscribed';

export default ShowUnsubscribed;
