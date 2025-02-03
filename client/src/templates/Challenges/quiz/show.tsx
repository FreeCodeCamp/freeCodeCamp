import { graphql, navigate } from 'gatsby';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Helmet from 'react-helmet';
import { ObserveKeys } from 'react-hotkeys';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Dispatch } from 'redux';
import { createSelector } from 'reselect';
import { useLocation, navigate as reachNavigate } from '@gatsbyjs/reach-router';
import {
  Container,
  Col,
  Row,
  Button,
  Quiz,
  useQuiz,
  Spacer
} from '@freecodecamp/ui';

// Local Utilities
import { shuffleArray } from '../../../../../shared/utils/shuffle-array';
import LearnLayout from '../../../components/layouts/learn';
import { ChallengeNode, ChallengeMeta, Test } from '../../../redux/prop-types';
import ChallengeDescription from '../components/challenge-description';
import Hotkeys from '../components/hotkeys';
import ChallengeTitle from '../components/challenge-title';
import CompletionModal from '../components/completion-modal';
import { getChallengePaths } from '../utils/challenge-paths';
import {
  challengeMounted,
  updateChallengeMeta,
  openModal,
  closeModal,
  updateSolutionFormValues,
  initTests
} from '../redux/actions';
import { isChallengeCompletedSelector } from '../redux/selectors';
import PrismFormatted from '../components/prism-formatted';
import { usePageLeave } from '../hooks';
import ExitQuizModal from './exit-quiz-modal';
import FinishQuizModal from './finish-quiz-modal';

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
      openExitQuizModal: () => openModal('exitQuiz'),
      closeExitQuizModal: () => closeModal('exitQuiz'),
      openFinishQuizModal: () => openModal('finishQuiz'),
      closeFinishQuizModal: () => closeModal('finishQuiz')
    },
    dispatch
  );

// Types
interface ShowQuizProps {
  challengeMounted: (arg0: string) => void;
  data: { challengeNode: ChallengeNode };
  description: string;
  initTests: (xs: Test[]) => void;
  isChallengeCompleted: boolean;
  pageContext: {
    challengeMeta: ChallengeMeta;
  };
  updateChallengeMeta: (arg0: ChallengeMeta) => void;
  updateSolutionFormValues: () => void;
  openCompletionModal: () => void;
  openExitQuizModal: () => void;
  closeExitQuizModal: () => void;
  openFinishQuizModal: () => void;
  closeFinishQuizModal: () => void;
}

const ShowQuiz = ({
  challengeMounted,
  data: {
    challengeNode: {
      challenge: {
        fields: { tests, blockHashSlug },
        title,
        description,
        challengeType,
        helpCategory,
        superBlock,
        block,
        translationPending,
        quizzes
      }
    }
  },
  pageContext: { challengeMeta },
  initTests,
  updateChallengeMeta,
  isChallengeCompleted,
  openCompletionModal,
  openExitQuizModal,
  closeExitQuizModal,
  openFinishQuizModal,
  closeFinishQuizModal
}: ShowQuizProps) => {
  const { t } = useTranslation();
  const curLocation = useLocation();

  const container = useRef<HTMLElement | null>(null);

  // Campers are not allowed to change their answers once the quiz is submitted.
  // `hasSubmitted` is used as a flag to disable the quiz.
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // `isPassed` is used as a flag to conditionally render the test or submit button.
  const [isPassed, setIsPassed] = useState(false);

  const [showUnanswered, setShowUnanswered] = useState(false);

  const [exitConfirmed, setExitConfirmed] = useState(false);

  const blockNameTitle = `${t(
    `intro:${superBlock}.blocks.${block}.title`
  )} - ${title}`;

  const [quizId] = useState(Math.floor(Math.random() * quizzes.length));
  const quiz = quizzes[quizId].questions;

  // Initialize the data passed to `useQuiz`
  const [initialQuizData] = useState(
    quiz.map(question => {
      const distractors = question.distractors.map((distractor, index) => {
        return {
          label: (
            <PrismFormatted className='quiz-answer-label' text={distractor} />
          ),
          value: index + 1
        };
      });

      const answer = {
        label: (
          <PrismFormatted
            className='quiz-answer-label'
            text={question.answer}
          />
        ),
        value: 4
      };

      return {
        question: <PrismFormatted text={question.text} />,
        answers: shuffleArray([...distractors, answer]),
        correctAnswer: answer.value
      };
    })
  );

  const {
    questions: quizData,
    validateAnswers,
    validated,
    correctAnswerCount
  } = useQuiz({
    initialQuestions: initialQuizData,
    validationMessages: {
      correct: t('learn.quiz.correct-answer'),
      incorrect: t('learn.quiz.incorrect-answer')
    },
    passingGrade: 90,
    onSuccess: () => {
      openCompletionModal(), setIsPassed(true);
    },
    onFailure: () => setIsPassed(false)
  });

  const unanswered = quizData.reduce<number[]>(
    (acc, curr, id) => (curr.selectedAnswer == null ? [...acc, id + 1] : acc),
    []
  );

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

  const handleFinishQuiz = () => {
    setShowUnanswered(true);

    if (unanswered.length === 0) {
      openFinishQuizModal();
    }
  };

  const handleFinishQuizModalBtnClick = () => {
    validateAnswers();
    setHasSubmitted(true);
    closeFinishQuizModal();
  };

  const handleSubmitAndGo = () => {
    openCompletionModal();
  };

  const handleExitQuiz = () => {
    openExitQuizModal();
  };

  const handleExitQuizModalBtnClick = () => {
    setExitConfirmed(true);
    void navigate(blockHashSlug);
    closeExitQuizModal();
  };

  const onWindowClose = useCallback(
    (event: BeforeUnloadEvent) => {
      event.preventDefault();
      window.confirm(t('misc.navigation-warning'));
    },
    [t]
  );

  const onHistoryChange = useCallback(() => {
    // We don't block navigation in the following cases.
    // - When campers have submitted the quiz:
    //   - If they don't pass, the Finish Quiz button is disabled, there isn't anything for them to do other than leaving the page
    //   - If they pass, the Submit-and-go button shows up, and campers should be allowed to leave the page
    // - When they have clicked the exit button on the exit modal
    if (hasSubmitted || exitConfirmed) {
      return;
    }

    // We need to use Reach Router, because the pathname is already prefixed
    // with the language and Gatsby's navigate will prefix it again.
    void reachNavigate(`${curLocation.pathname}`);
    openExitQuizModal();
  }, [curLocation.pathname, hasSubmitted, exitConfirmed, openExitQuizModal]);

  usePageLeave({
    onWindowClose,
    onHistoryChange
  });

  function getErrorMessage() {
    if (showUnanswered && unanswered.length > 0) {
      return t('learn.quiz.unanswered-questions', {
        unansweredQuestions: unanswered.join(', ')
      });
    }

    if (validated) {
      // TODO: Update the message to include link(s) to the review materials
      // if campers didn't pass the quiz.
      return t('learn.quiz.have-n-correct-questions', {
        correctAnswerCount,
        total: quiz.length
      });
    }

    return '';
  }

  const errorMessage = getErrorMessage();

  return (
    <Hotkeys
      executeChallenge={!isPassed ? handleFinishQuiz : handleSubmitAndGo}
      containerRef={container}
    >
      <LearnLayout>
        <Helmet
          title={`${blockNameTitle} | ${t('learn.learn')} | freeCodeCamp.org`}
        />
        <Container className='quiz-challenge-container'>
          <Row>
            <Spacer size='m' />
            <ChallengeTitle
              isCompleted={isChallengeCompleted}
              translationPending={translationPending}
            >
              {title}
            </ChallengeTitle>

            <Col md={8} mdOffset={2} sm={10} smOffset={1} xs={12}>
              <Spacer size='m' />
              <ChallengeDescription
                description={description}
                superBlock={superBlock}
              />
              <Spacer size='l' />
              <ObserveKeys>
                <Quiz questions={quizData} disabled={hasSubmitted} />
              </ObserveKeys>
              <Spacer size='m' />
              <div aria-live='polite' aria-atomic='true'>
                {errorMessage}
              </div>
              <Spacer size='m' />
              {!isPassed ? (
                <>
                  <Button
                    block={true}
                    variant='primary'
                    onClick={handleFinishQuiz}
                    disabled={hasSubmitted}
                  >
                    {t('buttons.finish-quiz')}
                  </Button>
                </>
              ) : (
                <Button
                  block={true}
                  variant='primary'
                  onClick={handleSubmitAndGo}
                >
                  {t('buttons.submit-and-go')}
                </Button>
              )}
              <Spacer size='xxs' />
              <Button block={true} variant='primary' onClick={handleExitQuiz}>
                {t('buttons.exit-quiz')}
              </Button>
              <Spacer size='l' />
            </Col>
          </Row>
        </Container>
        <CompletionModal />
        <ExitQuizModal onExit={handleExitQuizModalBtnClick} />
        <FinishQuizModal onFinish={handleFinishQuizModalBtnClick} />
      </LearnLayout>
    </Hotkeys>
  );
};

ShowQuiz.displayName = 'ShowQuiz';

export default connect(mapStateToProps, mapDispatchToProps)(ShowQuiz);

export const query = graphql`
  query QuizChallenge($id: String!) {
    challengeNode(id: { eq: $id }) {
      challenge {
        title
        description
        challengeType
        helpCategory
        superBlock
        block
        fields {
          blockHashSlug
          blockName
          slug
          tests {
            text
            testString
          }
        }
        quizzes {
          questions {
            distractors
            text
            answer
          }
        }
        translationPending
      }
    }
  }
`;
