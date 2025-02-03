import { useLocation } from '@gatsbyjs/reach-router';

import React, { type FormEvent, useEffect } from 'react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Container, Row, Col, Button, Spacer } from '@freecodecamp/ui';
import BigCallToAction from '../components/landing/components/big-call-to-action';

import {
  isSignedInSelector,
  isDonatingSelector,
  updateCardStateSelector
} from '../redux/selectors';
import { updateCard, updateCardComplete } from '../redux/actions';
import { UpdateCardState } from '../redux/types';
import CardUpdateAlertHandler from '../components/Donation/card-update-alert-handler';

interface UpdateStripeCardProps {
  isNewEmail: boolean;
  resetDonationFormState: () => void;
  isSignedIn: boolean;
  isDonating: boolean;
  updateCardState: UpdateCardState;
  updateCard: () => void;
  updateCardComplete: () => void;
}

const mapStateToProps = createSelector(
  isSignedInSelector,
  isDonatingSelector,
  updateCardStateSelector,
  (
    isSignedIn: boolean,
    isDonating: boolean,
    updateCardState: UpdateCardState
  ) => ({
    isSignedIn,
    isDonating,
    updateCardState
  })
);

const mapDispatchToProps = { updateCard, updateCardComplete };

function ConditionalContent({
  isSignedIn,
  isDonating,
  handleClick,
  updateCardState
}: {
  isSignedIn: boolean;
  isDonating: boolean;
  handleClick: (e?: FormEvent) => void;
  updateCardState: UpdateCardState;
}) {
  const { t } = useTranslation();

  if (isSignedIn && !isDonating) {
    return (
      <>
        <h1 className='text-center'>{t('learn.donation-record-not-found')}</h1>
        <Spacer size='m' />
        <p className='text-center'>{t('learn.contact-support-mistake')}</p>
      </>
    );
  } else if (isSignedIn && isDonating) {
    const { success, error, redirecting } = updateCardState;
    if (redirecting || error || success) {
      return (
        <CardUpdateAlertHandler
          success={success}
          error={error}
          redirecting={redirecting}
          reset={handleClick}
        />
      );
    } else
      return (
        <>
          <Spacer size='m' />
          <Button block={true} onClick={handleClick}>
            {t('buttons.update-card')}
          </Button>
        </>
      );
  } else
    return (
      <>
        <h1 className='text-center'>{t('learn.sign-in-card-update')}</h1>
        <Spacer size='m' />
        <BigCallToAction text={t('buttons.sign-in')} />
      </>
    );
}

function UpdateStripeCard({
  isSignedIn,
  isDonating,
  updateCardState,
  updateCard,
  updateCardComplete
}: UpdateStripeCardProps) {
  function handleClick(event?: FormEvent) {
    updateCard();
    if (event) event.preventDefault();
  }
  const { t } = useTranslation();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isUpdateSuccessful = searchParams.get('session_id') !== null;

  useEffect(() => {
    if (isUpdateSuccessful) {
      updateCardComplete();
    }
  }, [isUpdateSuccessful, updateCardComplete]);

  return (
    <>
      <Helmet>
        <title>{t('misc.update-your-card')} | freeCodeCamp.org</title>
      </Helmet>
      <Container className='page-wrapper-80'>
        <Row>
          <Col sm={6} smOffset={3}>
            <Spacer size='l' />
            <ConditionalContent
              isSignedIn={isSignedIn}
              isDonating={isDonating}
              handleClick={handleClick}
              updateCardState={updateCardState}
            />
            <Spacer size='l' />
          </Col>
        </Row>
      </Container>
    </>
  );
}

UpdateStripeCard.displayName = 'Update-Stripe-Card';

export default connect(mapStateToProps, mapDispatchToProps)(UpdateStripeCard);
