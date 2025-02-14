import { challengeTypes } from '../../../../../shared/config/challenge-types';
import frameRunnerData from '../../../../../client/config/browser-scripts/frame-runner.json';
import jsTestEvaluatorData from '../../../../../client/config/browser-scripts/test-evaluator.json';
import pyTestEvaluatorData from '../../../../../client/config/browser-scripts/python-test-evaluator.json';

import { ChallengeFile, ChallengeMeta } from '../../../redux/prop-types';
import { concatHtml } from '../rechallenge/builders';
import {
  getTransformers,
  embedFilesInHtml,
  getPythonTransformers,
  getMultifileJSXTransformers
} from '../rechallenge/transformers';
import {
  createTestFramer,
  runTestInTestFrame,
  createMainPreviewFramer,
  createProjectPreviewFramer,
  ProxyLogger,
  TestRunnerConfig,
  Context,
  Source
} from './frame';
import { WorkerExecutor } from './worker-executor';

interface BuildChallengeData extends Context {
  challengeType: number;
  challengeFiles?: ChallengeFile[];
  required: { src?: string }[];
  template: string;
  url: string;
}

interface BuildOptions {
  preview: boolean;
  disableLoopProtectTests: boolean;
  disableLoopProtectPreview: boolean;
  usesTestRunner?: boolean;
}

const { filename: jsTestEvaluator } = jsTestEvaluatorData;
const { filename: pyTestEvaluator } = pyTestEvaluatorData;

const frameRunnerSrc = `/js/${frameRunnerData.filename}.js`;

const pythonWorkerExecutor = new WorkerExecutor(pyTestEvaluator, {
  terminateWorker: false,
  maxWorkers: 1
});
const jsWorkerExecutor = new WorkerExecutor(jsTestEvaluator, {
  terminateWorker: true
});

type ApplyFunctionProps = (
  file: ChallengeFile
) => Promise<ChallengeFile> | ChallengeFile;

const applyFunction =
  (fn: ApplyFunctionProps) => async (file: ChallengeFile) => {
    try {
      if (file.error) {
        return file;
      }
      const newFile = await fn.call(this, file);
      if (typeof newFile !== 'undefined') {
        return newFile;
      }
      return file;
    } catch (error) {
      return { ...file, error };
    }
  };

const composeFunctions = (...fns: ApplyFunctionProps[]) =>
  fns.map(applyFunction).reduce((f, g) => x => f(x).then(g));

// TODO: split this into at least two functions. One to create 'original' i.e.
// the source and another to create the contents.
function buildSourceMap(challengeFiles: ChallengeFile[]): Source | undefined {
  // TODO: rename sources.index to sources.contents.
  const source: Source | undefined = challengeFiles?.reduce(
    (sources, challengeFile) => {
      sources.index += challengeFile.source || '';
      sources.contents = sources.index;
      sources.original[challengeFile.history[0]] = challengeFile.source ?? null;
      sources.editableContents += challengeFile.editableContents || '';
      return sources;
    },
    {
      index: '',
      editableContents: '',
      original: {}
    } as Source
  );
  return source;
}

export const buildFunctions = {
  [challengeTypes.js]: buildJSChallenge,
  [challengeTypes.jsProject]: buildJSChallenge,
  [challengeTypes.html]: buildDOMChallenge,
  [challengeTypes.modern]: buildDOMChallenge,
  [challengeTypes.backend]: buildBackendChallenge,
  [challengeTypes.backEndProject]: buildBackendChallenge,
  [challengeTypes.pythonProject]: buildBackendChallenge,
  [challengeTypes.multifileCertProject]: buildDOMChallenge,
  [challengeTypes.colab]: buildBackendChallenge,
  [challengeTypes.python]: buildPythonChallenge,
  [challengeTypes.multifilePythonCertProject]: buildPythonChallenge,
  [challengeTypes.lab]: buildDOMChallenge,
  [challengeTypes.jsLab]: buildJSChallenge
};

export function canBuildChallenge(challengeData: BuildChallengeData): boolean {
  const { challengeType } = challengeData;
  return Object.prototype.hasOwnProperty.call(buildFunctions, challengeType);
}

export async function buildChallenge(
  challengeData: BuildChallengeData,
  options: BuildOptions
) {
  const { challengeType } = challengeData;
  const build = buildFunctions[challengeType];
  if (build) {
    return build(challengeData, options);
  }
  throw new Error(`Cannot build challenge of type ${challengeType}`);
}

const testRunners = {
  [challengeTypes.js]: getJSTestRunner,
  [challengeTypes.html]: getDOMTestRunner,
  [challengeTypes.backend]: getDOMTestRunner,
  [challengeTypes.pythonProject]: getDOMTestRunner,
  [challengeTypes.python]: getPyTestRunner,
  [challengeTypes.multifileCertProject]: getDOMTestRunner,
  [challengeTypes.multifilePythonCertProject]: getPyTestRunner,
  [challengeTypes.lab]: getDOMTestRunner
};

export function getTestRunner(
  buildData: BuildChallengeData,
  runnerConfig: TestRunnerConfig,
  document: Document
) {
  const { challengeType } = buildData;
  const testRunner = testRunners[challengeType];
  if (testRunner) {
    return testRunner(buildData, runnerConfig, document);
  }
  throw new Error(`Cannot get test runner for challenge type ${challengeType}`);
}

function getJSTestRunner(
  { build, sources }: BuildChallengeData,
  { proxyLogger }: TestRunnerConfig
) {
  return getWorkerTestRunner(
    { build, sources },
    { proxyLogger },
    jsWorkerExecutor
  );
}

function getPyTestRunner(
  { build, sources }: BuildChallengeData,
  { proxyLogger }: TestRunnerConfig
) {
  return getWorkerTestRunner(
    { build, sources },
    { proxyLogger },
    pythonWorkerExecutor
  );
}

function getWorkerTestRunner(
  { build, sources }: Pick<BuildChallengeData, 'build' | 'sources'>,
  { proxyLogger }: TestRunnerConfig,
  workerExecutor: WorkerExecutor
) {
  const code = {
    contents: sources.index,
    editableContents: sources.editableContents,
    original: sources.original
  };

  interface TestWorkerExecutor extends WorkerExecutor {
    on: (event: string, listener: (...args: string[]) => void) => void;
    done: () => void;
  }

  return (testString: string, testTimeout: number, firstTest = true) => {
    const result = workerExecutor.execute(
      { build, testString, code, sources, firstTest },
      testTimeout
    ) as TestWorkerExecutor;

    result.on('LOG', proxyLogger);
    return result.done;
  };
}

async function getDOMTestRunner(
  buildData: BuildChallengeData,
  { proxyLogger }: TestRunnerConfig,
  document: Document
) {
  await new Promise<void>(resolve =>
    createTestFramer(document, proxyLogger, resolve)(buildData)
  );
  return (testString: string, testTimeout: number) =>
    runTestInTestFrame(document, testString, testTimeout);
}

type BuildResult = {
  challengeType: number;
  build?: string;
  sources: Source | undefined;
  loadEnzyme?: boolean;
  error?: unknown;
};

// TODO: All the buildXChallenge files have a similar structure, so make that
// abstraction (function, class, whatever) and then create the various functions
// out of it.
export async function buildDOMChallenge(
  { challengeFiles, required = [], template = '' }: BuildChallengeData,
  options?: BuildOptions
): Promise<BuildResult> {
  // TODO: make this required in the schema.
  if (!challengeFiles) throw Error('No challenge files provided');
  const hasJsx = challengeFiles.some(
    challengeFile => challengeFile.ext === 'jsx'
  );
  const isMultifile = challengeFiles.length > 1;

  const requiresReact16 = required.some(({ src }) =>
    src?.includes('https://unpkg.com/react@16')
  );

  // I'm reasonably sure this is fine, but we need to migrate transformers to
  // TypeScript to be sure.
  const transformers: ApplyFunctionProps[] = (isMultifile && hasJsx
    ? getMultifileJSXTransformers(options)
    : getTransformers(options)) as unknown as ApplyFunctionProps[];

  const pipeLine = composeFunctions(...transformers);
  const usesTestRunner = options?.usesTestRunner ?? false;
  const finalFiles = await Promise.all(challengeFiles.map(pipeLine));
  const error = finalFiles.find(({ error }) => error)?.error;
  const contents = (await embedFilesInHtml(finalFiles)) as string;

  // if there is an error, we just build the test runner so that it can be
  // used to run tests against the code without actually running the code.
  const toBuild = error
    ? { ...(usesTestRunner && { testRunner: frameRunnerSrc }) }
    : {
        required,
        template,
        contents,
        ...(usesTestRunner && { testRunner: frameRunnerSrc })
      };

  return {
    // TODO: Stop overwriting challengeType with 'html'. Figure out why it's
    // necessary at the moment.
    challengeType: challengeTypes.html,
    build: concatHtml(toBuild),
    sources: buildSourceMap(finalFiles),
    loadEnzyme: requiresReact16,
    error
  };
}

export async function buildJSChallenge(
  { challengeFiles }: { challengeFiles?: ChallengeFile[] },
  options: BuildOptions
): Promise<BuildResult> {
  if (!challengeFiles) throw Error('No challenge files provided');
  const pipeLine = composeFunctions(
    ...(getTransformers(options) as unknown as ApplyFunctionProps[])
  );

  const finalFiles = await Promise.all(challengeFiles?.map(pipeLine));
  const error = finalFiles.find(({ error }) => error)?.error;

  const toBuild = error ? [] : finalFiles;

  return {
    challengeType: challengeTypes.js,
    build: toBuild
      .reduce(
        (body, challengeFile) => [
          ...body,
          challengeFile.head,
          challengeFile.contents,
          challengeFile.tail
        ],
        [] as string[]
      )
      .join('\n'),
    sources: buildSourceMap(finalFiles),
    error
  };
}

function buildBackendChallenge({ url }: BuildChallengeData) {
  return {
    challengeType: challengeTypes.backend,
    build: concatHtml({ testRunner: frameRunnerSrc }),
    sources: { url }
  };
}

export async function buildPythonChallenge({
  challengeFiles
}: BuildChallengeData): Promise<BuildResult> {
  if (!challengeFiles) throw new Error('No challenge files provided');
  const pipeLine = composeFunctions(
    ...(getPythonTransformers() as unknown as ApplyFunctionProps[])
  );
  const finalFiles = await Promise.all(challengeFiles.map(pipeLine));
  const error = finalFiles.find(({ error }) => error)?.error;

  return {
    challengeType:
      challengeFiles[0].editableRegionBoundaries?.length === 0
        ? challengeTypes.multifilePythonCertProject
        : challengeTypes.python,
    sources: buildSourceMap(finalFiles),
    error
  };
}

export function updatePreview(
  buildData: BuildChallengeData,
  document: Document,
  proxyLogger: ProxyLogger
): Promise<void> {
  // TODO: either create a 'buildType' or use the real challengeType here
  // (buildData.challengeType is set to 'html' for challenges that can be
  // previewed, hence this being true for python challenges, multifile steps and
  // so on).

  if (
    buildData.challengeType === challengeTypes.html ||
    buildData.challengeType === challengeTypes.multifileCertProject ||
    buildData.challengeType === challengeTypes.lab
  ) {
    return new Promise<void>(resolve =>
      createMainPreviewFramer(
        document,
        proxyLogger,
        getDocumentTitle(buildData),
        resolve
      )(buildData)
    );
  } else {
    throw new Error(
      `Cannot show preview for challenge type ${buildData.challengeType}`
    );
  }
}

function getDocumentTitle(buildData: BuildChallengeData) {
  // Give iframe a title attribute for accessibility using the preview
  // document's <title>.

  const parser = new DOMParser();
  const doc = parser.parseFromString(buildData?.sources?.index, 'text/html');
  const title = doc.querySelector('title');

  return title?.innerText ?? 'challenge';
}

export function updateProjectPreview(
  buildData: BuildChallengeData,
  document: Document
): void {
  if (
    buildData.challengeType === challengeTypes.html ||
    buildData.challengeType === challengeTypes.multifileCertProject ||
    buildData.challengeType === challengeTypes.lab
  ) {
    createProjectPreviewFramer(
      document,
      getDocumentTitle(buildData)
    )(buildData);
  } else {
    throw new Error(
      `Cannot show preview for challenge type ${buildData.challengeType}`
    );
  }
}

export function challengeHasPreview({
  challengeType
}: {
  challengeType: number;
}): boolean {
  return (
    challengeType === challengeTypes.html ||
    challengeType === challengeTypes.modern ||
    challengeType === challengeTypes.multifileCertProject ||
    challengeType === challengeTypes.multifilePythonCertProject ||
    challengeType === challengeTypes.python ||
    challengeType === challengeTypes.lab
  );
}

export function isJavaScriptChallenge({
  challengeType
}: ChallengeMeta): boolean {
  return (
    challengeType === challengeTypes.js ||
    challengeType === challengeTypes.jsProject ||
    challengeType === challengeTypes.jsLab
  );
}
