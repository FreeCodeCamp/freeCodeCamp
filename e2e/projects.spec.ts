import { test, expect } from '@playwright/test';
import { SuperBlocks } from '../shared/config/superblocks';
import curriculum from '../shared/config/curriculum.json';
test.use({ storageState: 'playwright/.auth/certified-user.json' });

interface Meta {
  challengeOrder: { id: string; title: string }[];
}

interface File {
  contents: unknown;
  fileKey: string;
}

type Solution = File[];

interface Challenge {
  title: string;
  block: string;
  superBlock: string;
  dashedName: string;
  solutions: Solution[];
  isPrivate?: boolean;
}

interface Curriculum {
  [key: string]: {
    blocks: {
      [key: string]: {
        meta: Meta;
        challenges: Challenge[];
      };
    };
  };
}

const pythonProjects = {
  superBlock: SuperBlocks.MachineLearningPy,
  block: 'machine-learning-with-python-projects',
  challenges: [
    {
      slug: 'book-recommendation-engine-using-knn',
      nextChallengeText: 'Linear Regression Health Costs Calculator'
    },
    {
      slug: 'cat-and-dog-image-classifier',
      nextChallengeText: 'Book Recommendation Engine using KNN'
    },
    {
      slug: 'linear-regression-health-costs-calculator',
      nextChallengeText: 'Neural Network SMS Text Classifier'
    },
    {
      slug: 'neural-network-sms-text-classifier',
      nextChallengeText: 'Find the Symmetric Difference'
    },
    {
      slug: 'rock-paper-scissors',
      nextChallengeText: 'Cat and Dog Image Classifier'
    }
  ]
};

test.describe('Projects', () => {
  test('Should be possible to submit Python projects', async ({ page }) => {
    const { superBlock, block, challenges } = pythonProjects; // Ensure these are defined or imported

    for (const { slug } of challenges) {
      const url = `/learn/${superBlock}/${block}/${slug}`;
      await page.goto(url);
      await page
        .locator('#dynamic-front-end-form #solution')
        .fill('https://replit.com/@camperbot/python-project#main.py');

      await page.locator("text=I've completed this challenge").click();
      await expect(page.locator('text=go to next challenge')).toBeVisible();
    }
  });
});

test.describe('JavaScript projects can be submitted and then viewed in /settings and on the certifications', () => {
  test('projects are submitted and viewed correctly', async ({ page }) => {
    test.setTimeout(60000);
    const cur: Curriculum = { ...curriculum };

    const targetBlock = 'javascript-algorithms-and-data-structures-projects';
    const javaScriptSuperBlock = Object.values(cur).filter(
      ({ blocks }) => blocks[targetBlock]
    )[0];

    const { challenges, meta } = javaScriptSuperBlock?.blocks[targetBlock] || {
      challenges: [],
      meta: {}
    };

    const projectTitles =
      meta.challengeOrder?.map(({ title }: { title: string }) => title) ?? [];

    const projectsInOrder = projectTitles.map(title =>
      challenges.find(challenge => challenge.title === title)
    ) as Challenge[];

    const expectedPaths = projectsInOrder
      .slice(1)
      .map(
        ({ block, superBlock, dashedName }) =>
          `/learn/${superBlock}/${block}/${dashedName}`
      );

    expectedPaths.push('/learn/javascript-algorithms-and-data-structures/');

    for (const {
      superBlock,
      block,
      dashedName,
      solutions
    } of projectsInOrder) {
      const url = `/learn/${superBlock}/${block}/${dashedName}?testing=true`;
      await page.goto(url);

      for (const files of solutions) {
        for (const { contents } of files) {
          const editor = page.getByLabel('Editor content');

          await editor.click();
          await page.keyboard.press('Meta+A');
          await page.keyboard.press('Backspace');

          await editor.fill(contents as string);

          await page.getByRole('button', { name: 'Run the Tests' }).click();
          await page
            .getByRole('button', { name: 'Go to next challenge', exact: false })
            .click();
        }
      }
    }
  });
});
