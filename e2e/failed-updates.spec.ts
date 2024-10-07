import { execSync } from 'child_process';
import { test, expect } from '@playwright/test';
import { ChallengeData } from '../tools/challenge-editor/api/interfaces/challenge-data';

const failedUpdates = [
  {
    endpoint: '/modern-challenge-completed',
    payload: { id: '5dc1798ff86c76b9248c6eb3', challengeType: 0 },
    id: '4bd1d704-cfaa-44f7-92a3-bc0d857dbaa6'
  },
  {
    endpoint: '/modern-challenge-completed',
    payload: { id: '5dc17d3bf86c76b9248c6eb4', challengeType: 0 },
    id: 'ea289e2f-a5d2-45e0-b795-0f9f4afc5124'
  }
];
const storeKey = 'fcc-failed-updates';

function getCompletedIds(completedChallenges: ChallengeData[]): string[] {
  return completedChallenges.map((challenge: ChallengeData) => challenge.id);
}
test.use({ storageState: 'playwright/.auth/development-user.json' });

test.beforeAll(() => {
  execSync('node ./tools/scripts/seed/seed-demo-user');
});

test.afterAll(() => {
  execSync('node ./tools/scripts/seed/seed-demo-user --certified-user');
});

test.describe('failed update flushing', () => {
  test('should resubmit failed updates to the api and clear the store', async ({
    page,
    request
  }) => {
    // Initially, the user has no completed challenges.
    const userRes = await request.get(
      'http://localhost:3000/user/session-user'
    );
    const completedChallenges = (await userRes.json()).user.developmentuser
      .completedChallenges;
    expect(completedChallenges).toEqual([]);

    // It's necessary to wait until the page has loaded before setting the
    // localStorage. Otherwise, evaluate fails with a permissions error (the
    // store doesn't exist yet).
    await page.goto('/');
    await page.evaluate(
      ([failedUpdates, storeKey]) => {
        localStorage.setItem(storeKey, JSON.stringify(failedUpdates));
      },
      [failedUpdates, storeKey] as const
    );

    // The update epic sends two requests and this lets us wait for both.
    const submitRes = page
      .waitForResponse('http://localhost:3000/modern-challenge-completed')
      .then(() =>
        page.waitForResponse('http://localhost:3000/modern-challenge-completed')
      );

    await page.reload();
    await submitRes;

    const updatedUserRes = await request.get(
      'http://localhost:3000/user/session-user'
    );

    // Now the user should have both completed challenges.
    const updatedCompletedChallenges = (await updatedUserRes.json()).user
      .developmentuser.completedChallenges;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const completedIds = getCompletedIds(updatedCompletedChallenges);

    for (const { payload } of failedUpdates) {
      expect(completedIds).toContain(payload.id);
    }
    const storedFailedUpdates = await page.evaluate(storeKey => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(localStorage.getItem(storeKey) ?? '');
    }, storeKey);
    expect(storedFailedUpdates).toEqual([]);
  });
});
