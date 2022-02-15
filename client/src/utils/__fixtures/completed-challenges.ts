import {challengeFiles} from '../../../../utils/__fixtures__/challenges';

const baseChallenge = {
  id: '1',
  completedDate: 1,
  challengeFiles: []
}

export const onlySolution = {
  ...baseChallenge,
  solution: 'https://some-url.com'
}

export const invalidSolution = {
  ...baseChallenge,
  solution: 'some-url.com'
}

export const bothLinks = {
  ...baseChallenge,
  githubLink: 'https://some.thing',
  solution: 'https://some-url.com'
}

export const withChallenges = {
  ...bothLinks,
  challengeFiles
}

export const onlyGithubLink = {
  ...baseChallenge,
  githubLink: 'https://some.thing'
}

export const invalidGithubLink = {
  ...baseChallenge,
  githubLink: 'something',
  solution: 'https://some-url.com'
}
