const path = require('path');
const vm = require('vm');
const { assert, AssertionError } = require('chai');
const jsdom = require('jsdom');
const liveServer = require('@compodoc/live-server');
const lodash = require('lodash');
const Mocha = require('mocha');
const mockRequire = require('mock-require');
const spinner = require('ora')();
const puppeteer = require('puppeteer');
const stringSimilarity = require('string-similarity');

// lodash-es can't easily be used in node environments, so we just mock it out
// for the original lodash in testing.
mockRequire('lodash-es', lodash);

const clientPath = path.resolve(__dirname, '../../client');
require('@babel/register')({
  root: clientPath,
  babelrc: false,
  presets: ['@babel/preset-env', '@babel/typescript'],
  plugins: ['dynamic-import-node'],
  ignore: [/node_modules/],
  only: [clientPath]
});
const {
  buildDOMChallenge,
  buildPythonChallenge,
  buildChallenge,
  buildFunctions
} = require('../../client/src/templates/Challenges/utils/build');
const {
  WorkerExecutor
} = require('../../client/src/templates/Challenges/utils/worker-executor');
const {
  challengeTypes,
  hasNoSolution
} = require('../../shared/config/challenge-types');
// the config files are created during the build, but not before linting
const javaScriptTestEvaluator =
  require('../../client/config/browser-scripts/test-evaluator.json').filename;
const pythonTestEvaluator =
  require('../../client/config/browser-scripts/python-test-evaluator.json').filename;

const { getLines } = require('../../shared/utils/get-lines');

const { getChallengesForLang, getMetaForBlock } = require('../get-challenges');
const { challengeSchemaValidator } = require('../schema/challenge-schema');
const { testedLang, getSuperOrder } = require('../utils');
const {
  createHeader,
  testId
} = require('../../client/src/templates/Challenges/utils/frame');
const { SuperBlocks } = require('../../shared/config/curriculum');
const ChallengeTitles = require('./utils/challenge-titles');
const MongoIds = require('./utils/mongo-ids');
const createPseudoWorker = require('./utils/pseudo-worker');

const { sortChallenges } = require('./utils/sort-challenges');

const { flatten, isEmpty, cloneDeep } = lodash;

// rethrow unhandled rejections to make sure the tests exit with non-zero code
process.on('unhandledRejection', err => handleRejection(err));
// If an uncaught exception gets here, then mocha is in an unexpected state. All
// we can do is log the exception and exit with a non-zero code.
process.on('uncaughtException', err => {
  console.error('Uncaught exception:');
  console.error(err);
  process.exit(1);
});

// some errors *may* not be reported, since cleanup is triggered by the first
// error and that starts shutting down the browser and the server.
const handleRejection = err => {
  // setting the error code because node does not (yet) exit with a non-zero
  // code on unhandled exceptions.
  process.exitCode = 1;
  cleanup();
  console.error(err);
  if (process.env.FULL_OUTPUT !== 'true') process.exit();
};

const dom = new jsdom.JSDOM('');
global.document = dom.window.document;
global.DOMParser = dom.window.DOMParser;

const oldRunnerFail = Mocha.Runner.prototype.fail;
Mocha.Runner.prototype.fail = function (test, err) {
  if (err instanceof AssertionError) {
    const errMessage = String(err.message || '');
    const assertIndex = errMessage.indexOf(': expected');
    if (assertIndex !== -1) {
      err.message = errMessage.slice(0, assertIndex);
    }
    // Don't show stacktrace for assertion errors.
    if (err.stack) {
      delete err.stack;
    }
  }
  return oldRunnerFail.call(this, test, err);
};

async function newPageContext(browser) {
  const page = await browser.newPage();
  // it's needed for workers as context.
  await page.goto('http://127.0.0.1:8080/index.html');
  return page;
}

spinner.start();
spinner.text = 'Populate tests.';

let browser;
let page;
// This worker can be reused since it clears its environment between tests.
let pythonWorker;

setup()
  .then(runTests)
  .catch(err => handleRejection(err));

async function setup() {
  if (
    [
      process.env.FCC_BLOCK,
      process.env.FCC_CHALLENGE_ID,
      process.env.FCC_SUPERBLOCK
    ].filter(Boolean).length > 1
  ) {
    throw new Error(
      `Please use at most single input from: block, challenge id, superblock.`
    );
  }

  // liveServer starts synchronously
  liveServer.start({
    host: '127.0.0.1',
    port: '8080',
    root: path.resolve(__dirname, 'stubs'),
    mount: [['/js', path.join(clientPath, 'static/js')]],
    open: false,
    logLevel: 0
  });
  browser = await puppeteer.launch({
    args: [
      // Required for Docker version of Puppeteer
      '--no-sandbox',
      '--disable-setuid-sandbox',
      // This will write shared memory files into /tmp instead of /dev/shm,
      // because Docker’s default for /dev/shm is 64MB
      '--disable-dev-shm-usage'
      // dumpio: true
    ],
    headless: 'new'
  });
  global.Worker = createPseudoWorker(await newPageContext(browser));

  pythonWorker = new WorkerExecutor(pythonTestEvaluator, {
    terminateWorker: false
  });
  page = await newPageContext(browser);
  await page.setViewport({ width: 300, height: 150 });

  const lang = testedLang();

  let challenges = await getChallenges(lang);

  // the next few statements create a list of all blocks and superblocks
  // as they appear in the list of challenges
  const blocks = challenges.map(({ block }) => block);
  const superBlocks = challenges.map(({ superBlock }) => superBlock);
  const targetBlockStrings = [...new Set(blocks.filter(el => Boolean(el)))];
  const targetSuperBlockStrings = [
    ...new Set(superBlocks.filter(el => Boolean(el)))
  ];

  // the next few statements will filter challenges based on command variables
  if (process.env.FCC_SUPERBLOCK) {
    const filter = stringSimilarity.findBestMatch(
      process.env.FCC_SUPERBLOCK,
      targetSuperBlockStrings
    ).bestMatch.target;

    console.log(`\nsuperBlock being tested: ${filter}`);
    challenges = challenges.filter(
      challenge => challenge.superBlock === filter
    );

    if (!challenges.length) {
      throw new Error(`No challenges found with superBlock "${filter}"`);
    }
  }

  if (process.env.FCC_BLOCK) {
    const filter = stringSimilarity.findBestMatch(
      process.env.FCC_BLOCK,
      targetBlockStrings
    ).bestMatch.target;

    console.log(`\nblock being tested: ${filter}`);
    challenges = challenges.filter(challenge => challenge.block === filter);

    if (!challenges.length) {
      throw new Error(`No challenges found with block "${filter}"`);
    }
  }

  if (process.env.FCC_CHALLENGE_ID) {
    console.log(`\nChallenge Id being tested: ${process.env.FCC_CHALLENGE_ID}`);
    const challengeIndex = challenges.findIndex(
      challenge => challenge.id === process.env.FCC_CHALLENGE_ID
    );
    if (challengeIndex === -1) {
      throw new Error(
        `No challenge found with id "${process.env.FCC_CHALLENGE_ID}"`
      );
    }
    const { solutions = [] } = challenges[challengeIndex];
    if (isEmpty(solutions)) {
      // Project based curriculum usually has solution for current challenge in
      // next challenge's seed.
      challenges = challenges.slice(challengeIndex, challengeIndex + 2);
    } else {
      // Only one challenge is tested, but tests assume challenges is an array.
      challenges = [challenges[challengeIndex]];
    }
  }

  const meta = {};
  for (const challenge of challenges) {
    const dashedBlockName = challenge.block;
    // certifications do not have dashedBlockName's and don't have metas so
    // we can skip them.
    // TODO: omit certifications from the list of challenges
    if (dashedBlockName && !meta[dashedBlockName]) {
      meta[dashedBlockName] = await getMetaForBlock(dashedBlockName);
    }
  }
  return {
    meta,
    challenges,
    lang,
    superBlocks: targetSuperBlockStrings
  };
}

// First cleanup() inside catch block: Closes the browser if an error occurs.
//Second cleanup() inside finally block: Ensures the browser is closed after execution, even if there are no errors.
//This guarantees that the browser cleanup happens in both normal and error conditions.
async function cleanup() {
    if (browser) {
        try {
            if (browser.process()) {
                await browser.close();
                console.log('Browser closed successfully.');
            }
        } catch (err) {
            console.error('Error closing browser:', err);
        }
    }
}

async function main() {
    try {
        // Assume browser is launched here
        browser = await launchBrowser();

        // Perform some operations...

    } catch (error) {
        console.error('Error occurred:', error);
        await cleanup(); // Ensure cleanup on error
    } finally {
        await cleanup(); // Ensure cleanup at the end
    }
}

main();


function runTests(challengeData) {
  describe('Check challenges', function () {
    after(function () {
      cleanup();
    });
    populateTestsForLang(challengeData);
  });
  spinner.text = 'Testing';
  run();
}

async function getChallenges(lang) {
  const challenges = await getChallengesForLang(lang).then(curriculum =>
    Object.keys(curriculum)
      .map(key => curriculum[key].blocks)
      .reduce((challengeArray, superBlock) => {
        const challengesForBlock = Object.keys(superBlock).map(
          key => superBlock[key].challenges
        );
        return [...challengeArray, ...flatten(challengesForBlock)];
      }, [])
  );
  // This matches the order Gatsby uses (via a GraphQL query). Ideally both
  // should be sourced and sorted using a single query, but we're not there yet.
  return sortChallenges(challenges);
}

function populateTestsForLang({ lang, challenges, meta, superBlocks }) {
  const mongoIds = new MongoIds();
  const challengeTitles = new ChallengeTitles();
  const validateChallenge = challengeSchemaValidator();

  if (!process.env.FCC_BLOCK && !process.env.FCC_CHALLENGE_ID) {
    describe('Assert meta order', function () {
      const superBlocks = new Set([
        ...Object.values(meta).map(el => el.superBlock)
      ]);
      superBlocks.forEach(superBlock => {
        const filteredMeta = Object.values(meta)
          .filter(el => el.superBlock === superBlock)
          .sort((a, b) => a.order - b.order);
        if (!filteredMeta.length) {
          return;
        }
        it(`${superBlock} should have the same order in every meta`, function () {
          const firstOrder = getSuperOrder(filteredMeta[0].superBlock);
          assert.isNumber(firstOrder);
          assert.isTrue(
            filteredMeta.every(
              el => getSuperOrder(el.superBlock) === firstOrder
            ),
            'The superOrder properties are mismatched.'
          );
        });
        filteredMeta.forEach((meta, index) => {
          // Upcoming changes are in developmen so are not required to be in
          // order. FullStackDeveloper does not use the meta for order.
          if (
            !meta.isUpcomingChange &&
            meta.superBlock !== SuperBlocks.FullStackDeveloper
          ) {
            it(`${meta.superBlock} ${meta.name} must be in order`, function () {
              assert.equal(meta.order, index);
            });
          }
        });
      });
    });
  }

  superBlocks.forEach(superBlock => {
    describe(`Language: ${lang}`, function () {
      describe(`SuperBlock: ${superBlock}`, function () {
        this.timeout(5000);
        const superBlockChallenges = challenges.filter(
          c => c.superBlock === superBlock
        );
        superBlockChallenges.forEach((challenge, id) => {
          // When testing single challenge, in project based curriculum,
          // challenge to test (current challenge) might not have solution.
          // Instead seed from next challenge is tested against tests from
          // current challenge. Next challenge is skipped from testing.
          if (process.env.FCC_CHALLENGE_ID && id > 0) return;

          const dashedBlockName = challenge.block;
          // TODO: once certifications are not included in the list of challenges,
          // stop returning early here.
          if (typeof dashedBlockName === 'undefined') return;
          describe(`Block: ${challenge.block}`, function () {
            describe(`Title: ${challenge.title}`, function () {
              describe(`ID: ${challenge.id}`, function () {
                // Note: the title in meta.json are purely for human readability and
                // do not include translations, so we do not validate against them.
                it('Matches an ID in meta.json', function () {
                  const index = meta[
                    dashedBlockName
                  ]?.challengeOrder?.findIndex(({ id }) => id === challenge.id);

                  if (index < 0) {
                    throw new AssertionError(
                      `Cannot find ID "${challenge.id}" in meta.json file for block "${dashedBlockName}"`
                    );
                  }
                });

                it('Common checks', function () {
                  const result = validateChallenge(challenge);

                  if (result.error) {
                    throw new AssertionError(result.error);
                  }
                  const { id, title, block, dashedName } = challenge;
                  assert.exists(
                    dashedName,
                    `Missing dashedName for challenge ${id} in ${block}.`
                  );
                  const pathAndTitle = `${block}/${dashedName}`;
                  const idVerificationMessage = mongoIds.check(id, title);
                  assert.isNull(idVerificationMessage, idVerificationMessage);
                  const dupeTitleCheck = challengeTitles.check(
                    dashedName,
                    block
                  );
                  assert.isTrue(
                    dupeTitleCheck,
                    `All challenges within a block must have a unique dashed name. ${dashedName} (at ${pathAndTitle}) is already assigned`
                  );
                });

                const { challengeType } = challenge;

                if (hasNoSolution(challengeType)) return;

                let { tests = [] } = challenge;
                tests = tests.filter(test => !!test.testString);
                if (tests.length === 0) {
                  it('Check tests. No tests.');
                  return;
                }

                describe('Check tests syntax', function () {
                  tests.forEach(test => {
                    it(`Check for: ${test.text}`, function () {
                      assert.doesNotThrow(() => new vm.Script(test.testString));
                    });
                  });
                });

                if (challengeType === challengeTypes.backend) {
                  it('Check tests is not implemented.');
                  return;
                }

                // The python tests are (currently) slow, so we give them more time.
                const timePerTest =
                  challengeType === challengeTypes.python ? 10000 : 5000;
                it('Test suite must fail on the initial contents', async function () {
                  // TODO: some tests take a surprisingly long time to setup the
                  // test runner, so this timeout is large while we investigate.
                  this.timeout(timePerTest * tests.length + 20000);
                  // suppress errors in the console.
                  const oldConsoleError = console.error;
                  console.error = () => {};
                  let fails = false;
                  let testRunner;
                  try {
                    testRunner = await createTestRunner(
                      challenge,
                      challenge.challengeFiles,
                      buildChallenge
                    );
                  } catch {
                    fails = true;
                  }
                  if (!fails) {
                    for (const test of tests) {
                      try {
                        await testRunner(test);
                      } catch (e) {
                        fails = true;
                        break;
                      }
                    }
                  }
                  console.error = oldConsoleError;
                  assert(
                    fails,
                    'Test suite does not fail on the initial contents'
                  );
                });

                let { solutions = [] } = challenge;

                // if there's an empty string as solution, this is likely a mistake
                // TODO: what does this look like now? (this being detection of empty
                // lines in solutions - rather than entirely missing solutions)

                // We need to track where the solution came from to give better
                // feedback if the solution is failing.
                let solutionFromNext = false;

                if (isEmpty(solutions)) {
                  // if there are no solutions in the challenge, it's assumed the next
                  // challenge's seed will be a solution to the current challenge.
                  // This is expected to happen in the project based curriculum.

                  const nextChallenge = superBlockChallenges[id + 1];

                  if (nextChallenge) {
                    const solutionFiles = cloneDeep(
                      nextChallenge.challengeFiles
                    );
                    if (!solutionFiles) {
                      throw Error(
                        `No solution found.
Check the next challenge (${nextChallenge.title}): it should have a seed which solves the current challenge.
For example:

# --seed--

## --seed-contents--

\`\`\`js
seed goes here
\`\`\`
                  `
                      );
                    }
                    const solutionFilesWithEditableContents = solutionFiles.map(
                      file => ({
                        ...file,
                        editableContents: getLines(
                          file.contents,
                          file.editableRegionBoundaries
                        )
                      })
                    );
                    // Since there is only one seed, there can only be one solution,
                    // but the tests assume solutions is an array.
                    solutions = [solutionFilesWithEditableContents];
                    solutionFromNext = true;
                  } else {
                    throw Error(
                      `solution omitted for ${challenge.superBlock} ${challenge.block} ${challenge.title}`
                    );
                  }
                }

                // TODO: the no-solution filtering is a little convoluted:
                const noSolution = new RegExp('// solution required');

                const filteredSolutions = solutions.filter(solution => {
                  return !isEmpty(
                    solution.filter(
                      challengeFile => !noSolution.test(challengeFile.contents)
                    )
                  );
                });

                if (isEmpty(filteredSolutions)) {
                  it('Check tests. No solutions');
                  return;
                }

                describe('Check tests against solutions', function () {
                  solutions.forEach((solution, index) => {
                    it(`Solution ${
                      index + 1
                    } must pass the tests`, async function () {
                      this.timeout(timePerTest * tests.length + 2000);
                      const testRunner = await createTestRunner(
                        challenge,
                        solution,
                        buildChallenge,
                        solutionFromNext
                      );
                      for (const test of tests) {
                        await testRunner(test);
                      }
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}

async function createTestRunner(
  challenge,
  solutionFiles,
  buildChallenge,
  solutionFromNext
) {
  const challengeFiles = replaceChallengeFilesContentsWithSolutions(
    challenge.challengeFiles,
    solutionFiles
  );

  const { build, sources, loadEnzyme } = await buildChallenge(
    {
      ...challenge,
      challengeFiles
    },
    { usesTestRunner: true }
  );

  const code = {
    contents: sources.index,
    editableContents: sources.editableContents,
    original: sources.original
  };

  const buildFunction = buildFunctions[challenge.challengeType];

  const runsInBrowser = buildFunction === buildDOMChallenge;
  const runsInPythonWorker = buildFunction === buildPythonChallenge;

  const evaluator = await (runsInBrowser
    ? getContextEvaluator(build, sources, code, loadEnzyme)
    : getWorkerEvaluator(build, sources, code, runsInPythonWorker));

  return async ({ text, testString }) => {
    try {
      const { pass, err } = await evaluator.evaluate(testString, 5000);
      if (!pass) {
        throw err;
      }
    } catch (err) {
      // add more info to the error so the failing test can be identified.
      text = 'Test text: ' + text;
      const newMessage = solutionFromNext
        ? 'Check next step for solution!\n' + text
        : text;
      // if the stack is missing, the message should be included. Otherwise it
      // is redundant.
      err.message = err.stack
        ? newMessage
        : `${newMessage}
      ${err.message}`;
      throw err;
    }
  };
}

function replaceChallengeFilesContentsWithSolutions(
  challengeFiles,
  solutionFiles
) {
  return challengeFiles.map(file => {
    const matchingSolutionFile = solutionFiles.find(
      ({ ext, name }) => ext === file.ext && file.name === name
    );
    if (!matchingSolutionFile) {
      throw Error(
        `No matching solution file found for ${file.name}.${file.ext} - this likely means the seed code for the next step is missing the ${file.ext} code block.`
      );
    }
    return {
      ...file,
      contents: matchingSolutionFile.contents,
      editableContents: matchingSolutionFile.editableContents
    };
  });
}

async function getContextEvaluator(build, sources, code, loadEnzyme) {
  await initializeTestRunner(build, sources, code, loadEnzyme);

  return {
    evaluate: async (testString, timeout) =>
      Promise.race([
        new Promise((_, reject) =>
          setTimeout(() => reject('timeout'), timeout)
        ),
        await page.evaluate(async testString => {
          return await document.__runTest(testString);
        }, testString)
      ])
  };
}

async function getWorkerEvaluator(build, sources, code, runsInPythonWorker) {
  // The python worker clears the globals between tests, so it should be fine
  // to use the same evaluator for all tests. TODO: check if this is true for
  // sys, since sys.modules is not being reset.
  const testWorker = runsInPythonWorker
    ? pythonWorker
    : new WorkerExecutor(javaScriptTestEvaluator, { terminateWorker: true });
  return {
    evaluate: async (testString, timeout) =>
      await testWorker.execute({ testString, build, code, sources }, timeout)
        .done
  };
}

async function initializeTestRunner(build, sources, code, loadEnzyme) {
  await page.reload();
  await page.setContent(createHeader(testId) + build);
  await page.evaluate(
    async (code, sources, loadEnzyme) => {
      const getUserInput = fileName => sources[fileName];
      // TODO: use frame's functions directly, so it behaves more like the
      // client.
      await document.__initTestFrame({
        code: sources,
        getUserInput,
        loadEnzyme
      });
    },
    code,
    sources,
    loadEnzyme
  );
}
