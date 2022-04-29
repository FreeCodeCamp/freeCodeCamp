const fs = require('fs');
const path = require('path');
const util = require('util');
const assert = require('assert');
const yaml = require('js-yaml');
const { findIndex, isEmpty } = require('lodash');
const readDirP = require('readdirp');
const { helpCategoryMap } = require('../client/utils/challenge-types');
const { showUpcomingChanges } = require('../config/env.json');
const { curriculum: curriculumLangs } =
  require('../config/i18n/all-langs').availableLangs;
const { parseMD } = require('../tools/challenge-parser/parser');
const {
  translateCommentsInChallenge
} = require('../tools/challenge-parser/translation-parser');

const { isAuditedCert } = require('../utils/is-audited');
const { createPoly } = require('../utils/polyvinyl');
const { dasherize } = require('../utils/slugs');
const {
  getSuperOrder,
  getSuperBlockFromDir,
  generatePageId
} = require('./utils');

const originalPathData = require('./path-data.json');
const pathData = { pageIdToSubPath: {}, subPathToPageId: {} };

const access = util.promisify(fs.access);

const CHALLENGES_DIR = path.resolve(__dirname, 'challenges');
const META_DIR = path.resolve(CHALLENGES_DIR, '_meta');
exports.CHALLENGES_DIR = CHALLENGES_DIR;
exports.META_DIR = META_DIR;

const COMMENT_TRANSLATIONS = createCommentMap(
  path.resolve(__dirname, 'dictionaries')
);

function getTranslatableComments(dictionariesDir) {
  const COMMENTS_TO_TRANSLATE = require(path.resolve(
    dictionariesDir,
    'english',
    'comments.json'
  ));
  return Object.values(COMMENTS_TO_TRANSLATE);
}

exports.getTranslatableComments = getTranslatableComments;

function createCommentMap(dictionariesDir) {
  // get all the languages for which there are dictionaries.
  const languages = fs
    .readdirSync(dictionariesDir)
    .filter(x => x !== 'english');

  // get all their dictionaries
  const dictionaries = languages.reduce(
    (acc, lang) => ({
      ...acc,
      [lang]: require(path.resolve(dictionariesDir, lang, 'comments.json'))
    }),
    {}
  );

  // get the english dicts
  const COMMENTS_TO_TRANSLATE = require(path.resolve(
    dictionariesDir,
    'english',
    'comments.json'
  ));

  const COMMENTS_TO_NOT_TRANSLATE = require(path.resolve(
    dictionariesDir,
    'english',
    'comments-to-not-translate'
  ));

  // map from english comment text to translations
  const translatedCommentMap = Object.entries(COMMENTS_TO_TRANSLATE).reduce(
    (acc, [id, text]) => {
      return {
        ...acc,
        [text]: getTranslationEntry(dictionaries, { engId: id, text })
      };
    },
    {}
  );

  // map from english comment text to itself
  const untranslatableCommentMap = Object.values(
    COMMENTS_TO_NOT_TRANSLATE
  ).reduce((acc, text) => {
    const englishEntry = languages.reduce(
      (acc, lang) => ({
        ...acc,
        [lang]: text
      }),
      {}
    );
    return {
      ...acc,
      [text]: englishEntry
    };
  }, {});

  return { ...translatedCommentMap, ...untranslatableCommentMap };
}

exports.createCommentMap = createCommentMap;

function getTranslationEntry(dicts, { engId, text }) {
  return Object.keys(dicts).reduce((acc, lang) => {
    const entry = dicts[lang][engId];
    if (entry) {
      return { ...acc, [lang]: entry };
    } else {
      // default to english
      return { ...acc, [lang]: text };
    }
  }, {});
}

function getChallengesDirForLang(lang) {
  return path.resolve(CHALLENGES_DIR, `${lang}`);
}

function getMetaForBlock(block) {
  return JSON.parse(
    fs.readFileSync(path.resolve(META_DIR, `${block}/meta.json`), 'utf8')
  );
}

function parseCert(filePath) {
  return yaml.load(fs.readFileSync(filePath, 'utf8'));
}

exports.getChallengesDirForLang = getChallengesDirForLang;
exports.getMetaForBlock = getMetaForBlock;

// This recursively walks the directories starting at root, and calls cb for
// each file/directory and only resolves once all the callbacks do.
const walk = (root, target, options, cb) => {
  return new Promise(resolve => {
    let running = 1;
    function done() {
      if (--running === 0) {
        resolve(target);
      }
    }
    readDirP(root, options)
      .on('data', file => {
        running++;
        cb(file, target).then(done);
      })
      .on('end', done);
  });
};

exports.getChallengesForLang = async function getChallengesForLang(lang) {
  // english determines the shape of the curriculum, all other languages mirror
  // it.
  const root = getChallengesDirForLang('english');
  // scaffold the curriculum, first set up the superblocks, then recurse into
  // the blocks
  const curriculum = await walk(
    root,
    {},
    { type: 'directories', depth: 0 },
    buildSuperBlocks
  );
  Object.entries(curriculum).forEach(([name, superBlock]) => {
    assert(!isEmpty(superBlock.blocks), `superblock ${name} has no blocks`);
  });
  const cb = (file, curriculum) => buildChallenges(file, curriculum, lang);
  // fill the scaffold with the challenges
  const output = await walk(
    root,
    curriculum,
    { type: 'files', fileFilter: ['*.md', '*.yml'] },
    cb
  );

  const sortedPathData = sortPathData(pathData);
  await fs.promises.writeFile(
    path.resolve(__dirname, 'path-data.json'),
    JSON.stringify(sortedPathData, null, 2)
  );

  return output;
};

const sortPathData = ({ pageIdToSubPath, subPathToPageId }) => ({
  subPathToPageId: sortObject(subPathToPageId),
  pageIdToSubPath: sortObject(pageIdToSubPath)
});

function sortObject(obj) {
  const sortedObj = {};
  Object.keys(obj)
    .sort()
    .forEach(key => {
      sortedObj[key] = obj[key];
    });
  return sortedObj;
}

async function buildBlocks({ basename: blockName }, curriculum, superBlock) {
  const metaPath = path.resolve(META_DIR, `${blockName}/meta.json`);

  if (fs.existsSync(metaPath)) {
    // try to read the file, if the meta path does not exist it should be a certification.
    // As they do not have meta files.

    const blockMeta = JSON.parse(fs.readFileSync(metaPath));

    const { isUpcomingChange } = blockMeta;

    if (typeof isUpcomingChange !== 'boolean') {
      throw Error(
        `meta file at ${metaPath} is missing 'isUpcomingChange', it must be 'true' or 'false'`
      );
    }

    if (!isUpcomingChange || showUpcomingChanges) {
      // add the block to the superBlock
      const blockInfo = { meta: blockMeta, challenges: [] };
      curriculum[superBlock].blocks[blockName] = blockInfo;
    }
  } else {
    curriculum['certifications'].blocks[blockName] = { challenges: [] };
  }
}

async function buildSuperBlocks({ path, fullPath }, curriculum) {
  const superBlock = getSuperBlockFromDir(getBaseDir(path));
  curriculum[superBlock] = { blocks: {} };

  const cb = (file, curriculum) => buildBlocks(file, curriculum, superBlock);
  return walk(fullPath, curriculum, { depth: 1, type: 'directories' }, cb);
}

async function buildChallenges({ path: filePath }, curriculum, lang) {
  // path is relative to getChallengesDirForLang(lang)
  const block = getBlockNameFromPath(filePath);
  const superBlockDir = getBaseDir(filePath);
  const superBlock = getSuperBlockFromDir(superBlockDir);
  let challengeBlock;

  // TODO: this try block and process exit can all go once errors terminate the
  // tests correctly.
  try {
    challengeBlock = curriculum[superBlock].blocks[block];
    if (!challengeBlock) {
      // this should only happen when a isUpcomingChange block is skipped
      return;
    }
  } catch (e) {
    console.log(`failed to create superBlock from ${superBlockDir}`);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
  const { meta } = challengeBlock;
  const isCert = path.extname(filePath) === '.yml';
  // TODO: there's probably a better way, but this makes sure we don't build any
  // of the new curriculum when we don't want it.
  // if (
  //   process.env.SHOW_NEW_CURRICULUM !== 'true' &&
  //   meta?.superBlock === '2022/responsive-web-design'
  // ) {
  //   return;
  // }
  const createChallenge = generateChallengeCreator(CHALLENGES_DIR, lang);
  const challenge = isCert
    ? await createCertification(CHALLENGES_DIR, filePath, lang)
    : await createChallenge(filePath, meta);

  challengeBlock.challenges = [...challengeBlock.challenges, challenge];
}

async function parseTranslation(transPath, dict, lang, parse = parseMD) {
  const translatedChal = await parse(transPath);

  const { challengeType } = translatedChal;
  // challengeType 11 is for video challenges and 3 is for front-end projects
  // neither of which have seeds.
  return challengeType !== 11 && challengeType !== 3
    ? translateCommentsInChallenge(translatedChal, lang, dict)
    : translatedChal;
}

async function createCertification(basePath, filePath) {
  function getFullPath(pathLang) {
    return path.resolve(__dirname, basePath, pathLang, filePath);
  }
  // TODO: restart using isAudited() once we can determine a) the superBlocks
  // (plural) a certification belongs to and b) get that info from the parsed
  // certification, rather than the path. ASSUMING that this is used by the
  // client.  If not, delete this comment and the lang param.
  return parseCert(getFullPath('english'));
}

// This is a slightly weird abstraction, but it lets us define helper functions
// without passing around a ton of arguments.
function generateChallengeCreator(basePath, lang) {
  function getFullPath(pathLang, filePath) {
    return path.resolve(__dirname, basePath, pathLang, filePath);
  }

  async function validate(filePath, superBlock) {
    const invalidLang = !curriculumLangs.includes(lang);
    if (invalidLang)
      throw Error(`${lang} is not a accepted language.
Trying to parse ${filePath}`);

    const missingEnglish =
      lang !== 'english' && !(await hasEnglishSource(basePath, filePath));
    if (missingEnglish)
      throw Error(`Missing English challenge for
${filePath}
It should be in
${getFullPath('english', filePath)}
`);

    const missingAuditedChallenge =
      isAuditedCert(lang, superBlock) &&
      !fs.existsSync(getFullPath(lang, filePath));
    if (missingAuditedChallenge)
      throw Error(`Missing ${lang} audited challenge for
${filePath}
No audited challenges should fallback to English.
    `);
  }

  function addMetaToChallenge(challenge, meta) {
    const challengeOrder = findIndex(
      meta.challengeOrder,
      ([id]) => id === challenge.id
    );

    challenge.block = meta.name ? dasherize(meta.name) : null;
    challenge.hasEditableBoundaries = !!meta.hasEditableBoundaries;
    challenge.order = meta.order;
    const superOrder = getSuperOrder(meta.superBlock);
    // NOTE: Use this version when a super block is in beta.
    // const superOrder = getSuperOrder(meta.superBlock, {
    //   showNewCurriculum: process.env.SHOW_NEW_CURRICULUM === 'true'
    // });
    if (superOrder !== null) challenge.superOrder = superOrder;
    /* Since there can be more than one way to complete a certification (using the
   legacy curriculum or the new one, for instance), we need a certification
   field to track which certification this belongs to. */
    // TODO: generalize this to all superBlocks
    challenge.certification =
      meta.superBlock === '2022/responsive-web-design'
        ? 'responsive-web-design'
        : meta.superBlock;
    challenge.superBlock = meta.superBlock;
    challenge.challengeOrder = challengeOrder;
    challenge.isPrivate = challenge.isPrivate || meta.isPrivate;
    challenge.required = (meta.required || []).concat(challenge.required || []);
    challenge.template = meta.template;
    challenge.time = meta.time;
    challenge.helpCategory =
      challenge.helpCategory || helpCategoryMap[challenge.block];
    challenge.translationPending =
      lang !== 'english' && !isAuditedCert(lang, meta.superBlock);
    challenge.usesMultifileEditor = !!meta.usesMultifileEditor;
    if (challenge.challengeFiles) {
      // The client expects the challengeFiles to be an array of polyvinyls
      challenge.challengeFiles = challengeFilesToPolys(
        challenge.challengeFiles
      );
    }
    if (challenge.solutions?.length) {
      // The test runner needs the solutions to be arrays of polyvinyls so it
      // can sort them correctly.
      challenge.solutions = challenge.solutions.map(challengeFilesToPolys);
    }
  }

  function addPageId(challenge) {
    const pageId = getPageId(challenge);
    challenge.pageId = pageId;
  }

  function getPageId(challenge) {
    const { block, superBlock, dashedName } = challenge;
    const subPath = `${superBlock}/${block}/${dashedName}`;

    const pageId = hasStoredPageId(subPath, originalPathData)
      ? getStoredPageId(subPath, originalPathData)
      : tryToGeneratePageId(pathData, { len: 3 });

    storePageId(subPath, pageId, pathData);
    return pageId;
  }

  const hasStoredPageId = (subPath, data) =>
    data.subPathToPageId[subPath] !== undefined;

  const getStoredPageId = (subPath, data) => data.subPathToPageId[subPath];

  function tryToGeneratePageId(data, options) {
    const ATTEMPTS = 5;
    const { pageIdToSubPath } = data;

    for (let i = 0; i < ATTEMPTS; i++) {
      const pageId = generatePageId(options);
      if (!pageIdToSubPath[pageId]) {
        return pageId;
      }
    }
    throw Error(`${ATTEMPTS} attempts to generate a new pageId failed`);
  }

  function storePageId(subPath, pageId, data) {
    const { subPathToPageId, pageIdToSubPath } = data;
    subPathToPageId[subPath] = pageId;
    pageIdToSubPath[pageId] = subPath;
  }

  async function createChallenge(filePath, maybeMeta) {
    const meta = maybeMeta
      ? maybeMeta
      : require(path.resolve(
          META_DIR,
          `${getBlockNameFromPath(filePath)}/meta.json`
        ));

    await validate(filePath, meta.superBlock);

    const useEnglish =
      lang === 'english' ||
      !isAuditedCert(lang, meta.superBlock) ||
      !fs.existsSync(getFullPath(lang, filePath));

    const challenge = await (useEnglish
      ? parseMD(getFullPath('english', filePath))
      : parseTranslation(
          getFullPath(lang, filePath),
          COMMENT_TRANSLATIONS,
          lang
        ));

    addMetaToChallenge(challenge, meta);
    // TODO: extends this to all superBlocks once we're ready to migrate to the
    // new paths
    if (challenge.superBlock === '2022/responsive-web-design') {
      addPageId(challenge);
    }

    return challenge;
  }
  return createChallenge;
}

function challengeFilesToPolys(files) {
  return files.reduce((challengeFiles, challengeFile) => {
    return [
      ...challengeFiles,
      {
        ...createPoly(challengeFile),
        seed: challengeFile.contents.slice(0)
      }
    ];
  }, []);
}

async function hasEnglishSource(basePath, translationPath) {
  const englishRoot = path.resolve(__dirname, basePath, 'english');
  return await access(
    path.join(englishRoot, translationPath),
    fs.constants.F_OK
  )
    .then(() => true)
    .catch(() => false);
}

function getBaseDir(filePath) {
  const [baseDir] = filePath.split(path.sep);
  return baseDir;
}

function getBlockNameFromPath(filePath) {
  const [, block] = filePath.split(path.sep);
  return block;
}

exports.hasEnglishSource = hasEnglishSource;
exports.parseTranslation = parseTranslation;
exports.generateChallengeCreator = generateChallengeCreator;
