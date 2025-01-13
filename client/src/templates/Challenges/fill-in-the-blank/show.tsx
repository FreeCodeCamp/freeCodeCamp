// Package Utilities
import { graphql } from 'gatsby';
import React, { useEffect, useRef, useState } from 'react';
import Helmet from 'react-helmet';
import { ObserveKeys } from 'react-hotkeys';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Dispatch } from 'redux';
import { createSelector } from 'reselect';
import { Container, Col, Row, Button, Spacer } from '@freecodecamp/ui';
import ShortcutsModal from '../components/shortcuts-modal';

// Local Utilities
import LearnLayout from '../../../components/layouts/learn';
import { ChallengeNode, ChallengeMeta, Test } from '../../../redux/prop-types';
import Hotkeys from '../components/hotkeys';
import ChallengeTitle from '../components/challenge-title';
import ChallegeExplanation from '../components/challenge-explanation';
import CompletionModal from '../components/completion-modal';
import HelpModal from '../components/help-modal';
import FillInTheBlanks from '../components/fill-in-the-blanks';
import ChallengeTranscript from '../components/challenge-transcript';
import PrismFormatted from '../components/prism-formatted';
import {
  challengeMounted,
  updateChallengeMeta,
  openModal,
  updateSolutionFormValues,
  initTests
} from '../redux/actions';
import Scene from '../components/scene/scene';
import { SceneSubject } from '../components/scene/scene-subject';
import { getChallengePaths } from '../utils/challenge-paths';
import { isChallengeCompletedSelector } from '../redux/selectors';
import { replaceAppleQuotes } from '../../../utils/replace-apple-quotes';

import './show.css';

// Redux Setup
const mapStateToProps = createSelector(
  isChallengeCompletedSelector,
  (isChallengeCompleted: boolean) => ({
    isChallengeCompleted
  })
);
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      initTests,
      updateChallengeMeta,
      challengeMounted,
      updateSolutionFormValues,
      openCompletionModal: () => openModal('completion'),
      openHelpModal: () => openModal('help')
    },
    dispatch
  );

// Types
interface ShowFillInTheBlankProps {
  challengeMounted: (arg0: string) => void;
  data: { challengeNode: ChallengeNode };
  isChallengeCompleted: boolean;
  initTests: (xs: Test[]) => void;
  openCompletionModal: () => void;
  openHelpModal: () => void;
  pageContext: {
    challengeMeta: ChallengeMeta;
  };
  t: TFunction;
  updateChallengeMeta: (arg0: ChallengeMeta) => void;
  updateSolutionFormValues: () => void;
}

const ShowFillInTheBlank = ({
  data: {
    challengeNode: {
      challenge: {
        title,
        description,
        instructions,
        explanation,
        transcript,
        superBlock,
        block,
        translationPending,
        fields: { blockName, tests },
        challengeType,
        fillInTheBlank,
        helpCategory,
        scene
      }
    }
  },
  challengeMounted,
  openHelpModal,
  updateChallengeMeta,
  openCompletionModal,
  pageContext: { challengeMeta },
  isChallengeCompleted
}: ShowFillInTheBlankProps) => {
  const { t } = useTranslation();
  const emptyArray = fillInTheBlank.blanks.map(() => null);

  const [showWrong, setShowWrong] = useState(false);
  const [userAnswers, setUserAnswers] = useState<(null | string)[]>(emptyArray);
  const [answersCorrect, setAnswersCorrect] =
    useState<(null | boolean)[]>(emptyArray);
  const [allBlanksFilled, setAllBlanksFilled] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const container = useRef<HTMLElement | null>(null);

  useEffect(() => {
    initTests(tests);
    const challengePaths = getChallengePaths({
      currentCurriculumPaths: challengeMeta
    });
    updateChallengeMeta({
      ...challengeMeta,
      title,
      challengeType,
      helpCategory,
      ...challengePaths
    });
    challengeMounted(challengeMeta.id);
    container.current?.focus();
    // This effect should be run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = () => {
    const blankAnswers = fillInTheBlank.blanks.map(b => b.answer);

    const newAnswersCorrect = userAnswers.map(
      (userAnswer, i) =>
        !!userAnswer &&
        replaceAppleQuotes(userAnswer.trim()).toLowerCase() ===
          blankAnswers[i].toLowerCase()
    );
    setAnswersCorrect(newAnswersCorrect);
    const hasWrongAnswer = newAnswersCorrect.some(a => a === false);
    if (!hasWrongAnswer) {
      setShowFeedback(false);
      setFeedback(null);
      openCompletionModal();
    } else {
      const firstWrongIndex = newAnswersCorrect.findIndex(a => a === false);
      const feedback =
        firstWrongIndex >= 0
          ? fillInTheBlank.blanks[firstWrongIndex].feedback
          : null;

      setFeedback(feedback);
      setShowWrong(true);
      setShowFeedback(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const inputIndex = parseInt(e.target.getAttribute('data-index') as string);

    const newUserAnswers = [...userAnswers];
    newUserAnswers[inputIndex] = e.target.value;

    const newAnswersCorrect = [...answersCorrect];
    newAnswersCorrect[inputIndex] = null;

    const allBlanksFilled = newUserAnswers.every(a => a);

    setUserAnswers(newUserAnswers);
    setAnswersCorrect(newAnswersCorrect);
    setAllBlanksFilled(allBlanksFilled);
    setShowWrong(false);
  };

  const handlePlayScene = () => {
    sceneSubject.notify();
  };

  const blockNameTitle = `${t(
    `intro:${superBlock}.blocks.${block}.title`
  )} - ${title}`;

  const sceneSubject = new SceneSubject();

  return (
    <Hotkeys
      executeChallenge={() => handleSubmit()}
      containerRef={container}
      playScene={handlePlayScene}
    >
      <LearnLayout>
        <Helmet
          title={`${blockNameTitle} | ${t('learn.learn')} | freeCodeCamp.org`}
        />
        <Container>
          <Row>
            <Spacer size='m' />
            <ChallengeTitle
              isCompleted={isChallengeCompleted}
              translationPending={translationPending}
            >
              {title}
            </ChallengeTitle>

            <Col md={8} mdOffset={2} sm={10} smOffset={1} xs={12}>
              <PrismFormatted text={description} />
              <Spacer size='m' />
            </Col>

            {scene && <Scene scene={scene} sceneSubject={sceneSubject} />}

            <Col md={8} mdOffset={2} sm={10} smOffset={1} xs={12}>
              {transcript && <ChallengeTranscript transcript={transcript} />}

              {instructions && (
                <>
                  <PrismFormatted text={instructions} />
                  <Spacer size='xs' />
                </>
              )}

              {/* what we want to observe is ctrl/cmd + enter, but ObserveKeys is buggy and throws an error
                if it encounters a key combination, so we have to pass in the individual keys to observe */}
              <ObserveKeys only={['ctrl', 'cmd', 'enter']}>
                <FillInTheBlanks
                  fillInTheBlank={fillInTheBlank}
                  answersCorrect={answersCorrect}
                  showFeedback={showFeedback}
                  feedback={feedback}
                  showWrong={showWrong}
                  handleInputChange={handleInputChange}
                />
              </ObserveKeys>

              {explanation ? (
                <ChallegeExplanation explanation={explanation} />
              ) : (
                <Spacer size='m' />
              )}

              <Button
                block={true}
                variant='primary'
                disabled={!allBlanksFilled}
                onClick={() => handleSubmit()}
              >
                {t('buttons.check-answer')}
              </Button>
              <Spacer size='xxs' />
              <Button block={true} variant='primary' onClick={openHelpModal}>
                {t('buttons.ask-for-help')}
              </Button>
              <Spacer size='l' />
            </Col>
            <CompletionModal />
            <HelpModal challengeTitle={title} challengeBlock={blockName} />
          </Row>
        </Container>
        <ShortcutsModal />
      </LearnLayout>
    </Hotkeys>
  );
};

ShowFillInTheBlank.displayName = 'ShowFillInTheBlank';

export default connect(mapStateToProps, mapDispatchToProps)(ShowFillInTheBlank);

export const query = graphql`
  query FillInTheBlankChallenge($id: String!) {
    challengeNode(id: { eq: $id }) {
      challenge {
        title
        description
        instructions
        explanation
        challengeType
        helpCategory
        superBlock
        block
        fields {
          blockName
          slug
          tests {
            text
            testString
          }
        }
        fillInTheBlank {
          sentence
          blanks {
            answer
            feedback
          }
        }
        transcript
        scene {
          setup {
            background
            characters {
              character
              position {
                x
                y
                z
              }
              opacity
            }
            audio {
              filename
              startTime
              startTimestamp
              finishTimestamp
            }
            alwaysShowDialogue
          }
          commands {
            background
            character
            position {
              x
              y
              z
            }
            opacity
            startTime
            finishTime
            dialogue {
              text
              align
            }
          }
        }
        translationPending
      }
    }
  }
`;
