import { graphql } from 'gatsby';
import React, { useState, useEffect, useRef } from 'react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { HandlerProps } from 'react-reflex';
import { useMediaQuery } from 'react-responsive';
import { bindActionCreators, Dispatch } from 'redux';
import store from 'store';
import { editor } from 'monaco-editor';
import type { FitAddon } from 'xterm-addon-fit';

import { useFeature } from '@growthbook/growthbook-react';
import { challengeTypes } from '../../../../../shared/config/challenge-types';
import LearnLayout from '../../../components/layouts/learn';
import { MAX_MOBILE_WIDTH } from '../../../../config/misc';

import type {
  ChallengeData,
  ChallengeFiles,
  ChallengeMeta,
  ChallengeNode,
  ResizeProps,
  SavedChallenge,
  SavedChallengeFiles,
  Test
} from '../../../redux/prop-types';
import { isContained } from '../../../utils/is-contained';
import ChallengeDescription from '../components/challenge-description';
import Hotkeys from '../components/hotkeys';
import ResetModal from '../components/reset-modal';
import ChallengeTitle from '../components/challenge-title';
import CompletionModal from '../components/completion-modal';
import HelpModal from '../components/help-modal';
import ShortcutsModal from '../components/shortcuts-modal';
import Output from '../components/output';
import Preview, { type PreviewProps } from '../components/preview';
import ProjectPreviewModal from '../components/project-preview-modal';
import SidePanel from '../components/side-panel';
import VideoModal from '../components/video-modal';
import {
  cancelTests,
  challengeMounted,
  createFiles,
  executeChallenge,
  initConsole,
  initTests,
  initVisibleEditors,
  previewMounted,
  updateChallengeMeta,
  openModal,
  setEditorFocusability,
  setIsAdvancing
} from '../redux/actions';
import {
  challengeFilesSelector,
  consoleOutputSelector,
  isChallengeCompletedSelector
} from '../redux/selectors';
import { savedChallengesSelector } from '../../../redux/selectors';
import { getGuideUrl } from '../utils';
import { preloadPage } from '../../../../utils/gatsby/page-loading';
import envData from '../../../../config/env.json';
import ToolPanel from '../components/tool-panel';
import { getChallengePaths } from '../utils/challenge-paths';
import { XtermTerminal } from './xterm';
import MultifileEditor from './multifile-editor';
import DesktopLayout from './desktop-layout';
import MobileLayout from './mobile-layout';
import { mergeChallengeFiles } from './saved-challenges';

import './classic.css';
import '../components/test-frame.css';

const mapStateToProps = (state: unknown) => ({
  challengeFiles: challengeFilesSelector(state) as ChallengeFiles,
  output: consoleOutputSelector(state) as string[],
  isChallengeCompleted: isChallengeCompletedSelector(state) as boolean,
  savedChallenges: savedChallengesSelector(state) as SavedChallenge[]
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      createFiles,
      initConsole,
      initTests,
      initVisibleEditors,
      updateChallengeMeta,
      challengeMounted,
      executeChallenge,
      cancelTests,
      previewMounted,
      openModal,
      setEditorFocusability,
      setIsAdvancing
    },
    dispatch
  );

interface ShowClassicProps extends Pick<PreviewProps, 'previewMounted'> {
  cancelTests: () => void;
  challengeMounted: (arg0: string) => void;
  createFiles: (arg0: ChallengeFiles | SavedChallengeFiles) => void;
  data: { challengeNode: ChallengeNode };
  executeChallenge: (options?: { showCompletionModal: boolean }) => void;
  challengeFiles: ChallengeFiles;
  initConsole: (arg0: string) => void;
  initTests: (tests: Test[]) => void;
  initVisibleEditors: () => void;
  isChallengeCompleted: boolean;
  output: string[];
  pageContext: {
    challengeMeta: ChallengeMeta;
    projectPreview: {
      challengeData: ChallengeData;
    };
  };
  updateChallengeMeta: (arg0: ChallengeMeta) => void;
  openModal: (modal: string) => void;
  setEditorFocusability: (canFocus: boolean) => void;
  setIsAdvancing: (arg: boolean) => void;
  savedChallenges: SavedChallenge[];
}

interface ReflexLayout {
  codePane: { flex: number };
  editorPane: { flex: number };
  instructionPane: { flex: number };
  notesPane: { flex: number };
  previewPane: { flex: number };
  testsPane: { flex: number };
}

interface RenderEditorArgs {
  isMobileLayout: boolean;
  isUsingKeyboardInTablist: boolean;
}

const REFLEX_LAYOUT = 'challenge-layout';
const BASE_LAYOUT = {
  codePane: { flex: 1 },
  editorPane: { flex: 1 },
  instructionPane: { flex: 1 },
  previewPane: { flex: 0.7 },
  notesPane: { flex: 0.7 },
  testsPane: { flex: 0.3 }
};

// Used to prevent monaco from stealing mouse/touch events on the upper jaw
// content widget so they can trigger their default actions. (Issue #46166)
const handleContentWidgetEvents = (e: MouseEvent | TouchEvent): void => {
  const target = e.target as HTMLElement;
  if (target?.closest('.editor-upper-jaw')) {
    e.stopPropagation();
  }
};

const StepPreview = ({
  disableIframe,
  previewMounted,
  challengeType,
  xtermFitRef
}: Pick<PreviewProps, 'disableIframe' | 'previewMounted'> & {
  challengeType: number;
  xtermFitRef: React.MutableRefObject<FitAddon | null>;
}) => {
  return challengeType === challengeTypes.python ||
    challengeType === challengeTypes.multifilePythonCertProject ? (
    <XtermTerminal xtermFitRef={xtermFitRef} />
  ) : (
    <Preview disableIframe={disableIframe} previewMounted={previewMounted} />
  );
};

// The newline is important, because this text ends up in a `pre` element.
const defaultOutput = `
/**
* Your test output will go here
*/`;

function ShowClassic({
  challengeFiles,
  data: {
    challengeNode: {
      challenge: {
        challengeFiles: seedChallengeFiles,
        block,
        demoType,
        title,
        description,
        instructions,
        fields: { tests, blockName },
        challengeType,
        hasEditableBoundaries,
        superBlock,
        helpCategory,
        forumTopicId,
        usesMultifileEditor,
        notes,
        videoUrl,
        translationPending
      }
    }
  },
  pageContext: {
    challengeMeta,
    challengeMeta: { isFirstStep, nextChallengePath },
    projectPreview: { challengeData }
  },
  createFiles,
  cancelTests,
  challengeMounted,
  initConsole,
  initTests,
  initVisibleEditors,
  updateChallengeMeta,
  openModal,
  setIsAdvancing,
  savedChallenges,
  isChallengeCompleted,
  output,
  executeChallenge,
  previewMounted
}: ShowClassicProps) {
  const { t } = useTranslation();
  const [resizing, setResizing] = useState(false);
  const [usingKeyboardInTablist, setUsingKeyboardInTablist] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor>();
  const instructionsPanelRef = useRef<HTMLDivElement>(null);
  const xtermFitRef = useRef<FitAddon | null>(null);
  const isMobile = useMediaQuery({
    query: `(max-width: ${MAX_MOBILE_WIDTH}px)`
  });

  const guideUrl = getGuideUrl({ forumTopicId, title });

  const blockNameTitle = `${t(
    `intro:${superBlock}.blocks.${block}.title`
  )}: ${title}`;
  const windowTitle = `${blockNameTitle} | freeCodeCamp.org`;
  const showConsole =
    challengeType === challengeTypes.js ||
    challengeType === challengeTypes.jsLab;
  // TODO: show preview should NOT be computed like this. That determination is
  // made during the build (at least twice!). It should be either a prop or
  // computed from challengeType
  const hasPreview = [
    challengeTypes.html,
    challengeTypes.modern,
    challengeTypes.multifileCertProject,
    challengeTypes.multifilePythonCertProject,
    challengeTypes.python,
    challengeTypes.lab
  ].includes(challengeType);
  const getLayoutState = () => {
    const reflexLayout = store.get(REFLEX_LAYOUT) as ReflexLayout | null;

    // Check that the layout values stored are valid (exist in base layout). If
    // not valid, it will fallback to the base layout values and be set on next
    // user resize.
    const isValidLayout =
      reflexLayout &&
      isContained(Object.keys(BASE_LAYOUT), Object.keys(reflexLayout));

    if (!isValidLayout) store.remove(REFLEX_LAYOUT);

    return isValidLayout ? reflexLayout : BASE_LAYOUT;
  };

  const onPreviewResize = () => xtermFitRef.current?.fit();

  // layout: Holds the information of the panes sizes for desktop view
  const [layout, setLayout] = useState(getLayoutState());

  const onStopResize = (event: HandlerProps) => {
    setResizing(false);
    // 'name' is used to identify the Elements whose layout is stored.
    const { name, flex } = event.component.props;

    // onStopResize can be called multiple times before the state changes, so
    // we need an updater function to ensure all updates are applied.
    setLayout(l => {
      const newLayout = name ? { ...l, [name]: { flex } } : l;
      store.set(REFLEX_LAYOUT, newLayout);
      return newLayout;
    });
  };

  const setHtmlHeight = () => {
    const vh = String(window.innerHeight - 1);
    document.documentElement.style.height = vh + 'px';
  };
  const onResize = () => {
    setResizing(true);
  };
  const resizeProps: ResizeProps = {
    onResize,
    onStopResize
  };

  const updateUsingKeyboardInTablist = (
    usingKeyboardInTablist: boolean
  ): void => {
    setUsingKeyboardInTablist(usingKeyboardInTablist);
  };

  // AB testing Pre-fetch in the Spanish locale
  const isPreFetchEnabled = useFeature('prefetch_ab_test').on;
  useEffect(() => {
    if (isPreFetchEnabled && envData.clientLocale === 'espanol') {
      preloadPage(nextChallengePath);
    }
  }, [nextChallengePath, isPreFetchEnabled]);

  useEffect(() => {
    initializeComponent(title);
    // Bug fix for the monaco content widget and touch devices/right mouse
    // click. (Issue #46166)
    document.addEventListener('mousedown', handleContentWidgetEvents, true);
    document.addEventListener('contextmenu', handleContentWidgetEvents, true);
    document.addEventListener('touchstart', handleContentWidgetEvents, true);
    document.addEventListener('touchmove', handleContentWidgetEvents, true);
    document.addEventListener('touchend', handleContentWidgetEvents, true);

    window.addEventListener('resize', setHtmlHeight);
    setHtmlHeight();

    return () => {
      createFiles([]);
      cancelTests();
      document.removeEventListener(
        'mousedown',
        handleContentWidgetEvents,
        true
      );
      document.removeEventListener(
        'contextmenu',
        handleContentWidgetEvents,
        true
      );
      document.removeEventListener(
        'touchstart',
        handleContentWidgetEvents,
        true
      );
      document.removeEventListener(
        'touchmove',
        handleContentWidgetEvents,
        true
      );
      document.removeEventListener('touchend', handleContentWidgetEvents, true);
      window.removeEventListener('resize', setHtmlHeight);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeComponent = (title: string): void => {
    initConsole('');

    const savedChallenge = savedChallenges?.find(challenge => {
      return challenge.id === challengeMeta.id;
    });

    createFiles(
      mergeChallengeFiles(seedChallengeFiles, savedChallenge?.challengeFiles)
    );

    initTests(tests);

    initVisibleEditors();

    // Typically, this kind of preview only appears on the first step of a
    // project and is shown (once) automatically. In contrast, labs are more
    // freeform, so the preview is shown on demand.
    if (demoType === 'onLoad') openModal('projectPreview');
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
    setIsAdvancing(false);
  };

  const renderInstructionsPanel = ({
    toolPanel,
    hasDemo
  }: {
    toolPanel: React.ReactNode;
    hasDemo: boolean;
  }) => {
    return (
      <SidePanel
        challengeDescription={
          <ChallengeDescription
            description={description}
            instructions={instructions}
            superBlock={superBlock}
          />
        }
        challengeTitle={
          <ChallengeTitle
            isCompleted={isChallengeCompleted}
            translationPending={translationPending}
          >
            {title}
          </ChallengeTitle>
        }
        instructionsPanelRef={instructionsPanelRef}
        toolPanel={toolPanel}
        hasDemo={hasDemo}
      />
    );
  };

  const renderEditor = ({
    isMobileLayout,
    isUsingKeyboardInTablist
  }: RenderEditorArgs) => {
    return (
      challengeFiles && (
        <MultifileEditor
          challengeFiles={challengeFiles}
          block={block}
          superBlock={superBlock}
          containerRef={containerRef}
          description={description}
          editorRef={editorRef}
          initialTests={tests}
          isMobileLayout={isMobileLayout}
          isUsingKeyboardInTablist={isUsingKeyboardInTablist}
          resizeProps={resizeProps}
          title={title}
          usesMultifileEditor={usesMultifileEditor}
          showProjectPreview={demoType === 'onLoad'}
        />
      )
    );
  };

  return (
    <Hotkeys
      challengeType={challengeType}
      executeChallenge={executeChallenge}
      containerRef={containerRef}
      instructionsPanelRef={instructionsPanelRef}
      usesMultifileEditor={usesMultifileEditor}
      editorRef={editorRef}
    >
      <LearnLayout hasEditableBoundaries={hasEditableBoundaries}>
        <Helmet title={windowTitle} />
        {isMobile && (
          <MobileLayout
            editor={renderEditor({
              isMobileLayout: true,
              isUsingKeyboardInTablist: usingKeyboardInTablist
            })}
            hasEditableBoundaries={hasEditableBoundaries}
            hasPreview={hasPreview}
            instructions={renderInstructionsPanel({
              toolPanel: null,
              hasDemo: demoType === 'onClick'
            })}
            notes={notes}
            onPreviewResize={onPreviewResize}
            preview={
              <StepPreview
                challengeType={challengeType}
                disableIframe={resizing}
                previewMounted={previewMounted}
                xtermFitRef={xtermFitRef}
              />
            }
            windowTitle={windowTitle}
            testOutput={
              <Output defaultOutput={defaultOutput} output={output} />
            }
            toolPanel={
              <ToolPanel guideUrl={guideUrl} isMobile videoUrl={videoUrl} />
            }
            updateUsingKeyboardInTablist={updateUsingKeyboardInTablist}
            usesMultifileEditor={usesMultifileEditor}
          />
        )}
        {!isMobile && (
          <DesktopLayout
            challengeFiles={challengeFiles}
            challengeType={challengeType}
            editor={renderEditor({
              isMobileLayout: false,
              isUsingKeyboardInTablist: usingKeyboardInTablist
            })}
            hasEditableBoundaries={hasEditableBoundaries}
            hasPreview={hasPreview}
            instructions={renderInstructionsPanel({
              toolPanel: <ToolPanel guideUrl={guideUrl} videoUrl={videoUrl} />,
              hasDemo: demoType === 'onClick'
            })}
            isFirstStep={isFirstStep}
            layoutState={layout}
            notes={notes}
            onPreviewResize={onPreviewResize}
            preview={
              <StepPreview
                challengeType={challengeType}
                disableIframe={resizing}
                previewMounted={previewMounted}
                xtermFitRef={xtermFitRef}
              />
            }
            resizeProps={resizeProps}
            testOutput={
              <Output defaultOutput={defaultOutput} output={output} />
            }
            windowTitle={windowTitle}
            startWithConsoleShown={showConsole}
          />
        )}
        <CompletionModal />
        <HelpModal challengeTitle={title} challengeBlock={blockName} />
        <VideoModal videoUrl={videoUrl} />
        <ResetModal challengeType={challengeType} />
        <ProjectPreviewModal
          challengeData={challengeData}
          closeText={t('buttons.start-coding')}
          previewTitle={
            demoType === 'onClick'
              ? t('learn.demo-project-title')
              : t('learn.project-preview-title')
          }
        />
        <ShortcutsModal />
      </LearnLayout>
    </Hotkeys>
  );
}

ShowClassic.displayName = 'ShowClassic';

export default connect(mapStateToProps, mapDispatchToProps)(ShowClassic);

export const query = graphql`
  query ClassicChallenge($id: String!) {
    challengeNode(id: { eq: $id }) {
      challenge {
        block
        demoType
        title
        description
        id
        hasEditableBoundaries
        instructions
        notes
        challengeType
        helpCategory
        videoUrl
        superBlock
        translationPending
        forumTopicId
        fields {
          blockName
          slug
          tests {
            text
            testString
          }
        }
        required {
          link
          src
        }
        usesMultifileEditor
        challengeFiles {
          fileKey
          ext
          name
          contents
          head
          tail
          editableRegionBoundaries
          history
        }
      }
    }
  }
`;
