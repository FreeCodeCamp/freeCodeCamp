/* eslint-disable @typescript-eslint/no-base-to-string */
import ObjectID from 'bson-objectid';
// import { insertErms } from './insert-erms';

// Builds a block
// function getCodeBlock(label: string, content?: string) {
//   return `\`\`\`${label}
// ${typeof content !== 'undefined' ? content : ''}
// \`\`\`\n`;
// }

// Builds a section
// function getSeedSection(content: string, label: string) {
//   return content
//     ? `

// ## --${label}--

// ${content}`
//     : '';
// }

type StepOptions = {
  dashedName: string;
  title: string;
  challengeId: ObjectID;
  challengeSeeds: Record<string, ChallengeSeed>;
  stepNum: number;
  challengeType: number;
  isFirstChallenge?: boolean;
};

export interface ChallengeSeed {
  contents: string;
  ext: string;
  editableRegionBoundaries: number[];
  head?: string;
  tail?: string;
}

// Build the base markdown for a step
function getStepTemplate({
  challengeId,
  dashedName,
  title
  // challengeSeeds,
  // stepNum,
  // challengeType,
  // isFirstChallenge = false
}: StepOptions): string {
  // const seedTexts = Object.values(challengeSeeds)
  //   .map(({ contents, ext, editableRegionBoundaries }: ChallengeSeed) => {
  //     let fullContents = contents;
  //     if (editableRegionBoundaries.length >= 2) {
  //       fullContents = insertErms(contents, editableRegionBoundaries);
  //     }
  //     return getCodeBlock(ext, fullContents);
  //   })
  //   .join('\n');

  // const seedHeads = Object.values(challengeSeeds)
  //   .filter(({ head }: ChallengeSeed) => head)
  //   .map(({ ext, head }: ChallengeSeed) => getCodeBlock(ext, head))
  //   .join('\n');

  // const seedTails = Object.values(challengeSeeds)
  //   .filter(({ tail }: ChallengeSeed) => tail)
  //   .map(({ ext, tail }: ChallengeSeed) => getCodeBlock(ext, tail))
  //   .join('\n');

  // const stepDescription = `step ${stepNum} instructions`;
  // const seedChallengeSection = getSeedSection(seedTexts, 'seed-contents');
  // const seedHeadSection = getSeedSection(seedHeads, 'before-user-code');
  // const seedTailSection = getSeedSection(seedTails, 'after-user-code');

  //   const demoString = isFirstChallenge
  //     ? `
  // # demoType can either be 'onClick' or 'onLoad'. If the project or lab doesn't have a preview, delete the property
  // demoType: onClick`
  //     : '';

  return `---
id: ${challengeId.toString()}
title: ${title}
challengeType: 8
dashedName: ${dashedName}
---

# --description--

Answer all of the questions below correctly to pass the quiz.
`;
}

export { getStepTemplate };
