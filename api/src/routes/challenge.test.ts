/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { setupServer, superRequest } from '../../jest.utils';

const isValidChallengeCompletionErrorMsg = {
  type: 'error',
  message: 'That does not appear to be a valid challenge submission.'
};

const id1 = 'bd7123c8c441eddfaeb5bdef';
const id2 = 'bd7123c8c441eddfaeb5bdec';

const codeallyProject = {
  id: id1,
  challengeType: 13,
  solution: 'https://any.valid/url'
};
const backendProject = {
  id: id2,
  challengeType: 4,
  solution: 'https://any.valid/url',
  githubLink: 'https://github.com/anything/valid/'
};

const partialCompletion = { id: id1, completedDate: 1 };

describe('challengeRoutes', () => {
  setupServer();
  describe('Authenticated user', () => {
    let setCookies: string[];

    // Authenticate user
    beforeAll(async () => {
      const res = await superRequest('/auth/dev-callback', { method: 'GET' });
      expect(res.status).toBe(200);
      setCookies = res.get('Set-Cookie');
    });

    describe('POST /coderoad-challenge-completed', () => {
      beforeEach(async () => {
        const res = await superRequest('/auth/dev-callback', { method: 'GET' });
        expect(res.status).toBe(200);
        setCookies = res.get('Set-Cookie');
      });

      test('should return 500 if no tutorialId', async () => {
        const response = await superRequest('/coderoad-challenge-completed', {
          method: 'POST',
          setCookies
        });
        expect(response.status).toBe(500);
      });

      test('should return 400 if no user token', async () => {
        const response = await superRequest('/coderoad-challenge-completed', {
          method: 'POST',
          setCookies
        }).send({
          tutorialId: 'freeCodeCamp/learn-bash-by-building-a-boilerplate:v1.0.0'
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          msg: `'coderoad-user-token' not found in request headers`,
          type: 'error'
        });
      });

      test('should return 400 if invalid user token', async () => {
        const response = await superRequest('/coderoad-challenge-completed', {
          method: 'POST',
          setCookies
        })
          .set('coderoad-user-token', 'invalid')
          .send({
            tutorialId:
              'freeCodeCamp/learn-bash-by-building-a-boilerplate:v1.0.0'
          });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          msg: 'invalid user token',
          type: 'error'
        });
      });

      test('should return 400 if invalid tutorialId', async () => {
        const tokenResponse = await superRequest('/user/user-token', {
          method: 'POST',
          setCookies
        });
        expect(tokenResponse.status).toBe(200);
        expect(tokenResponse.body).toHaveProperty('userToken');

        const token = (tokenResponse.body as { userToken: string }).userToken;

        const response = await superRequest('/coderoad-challenge-completed', {
          method: 'POST',
          setCookies
        })
          .set('coderoad-user-token', token)
          .send({ tutorialId: 'invalid' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          msg: 'Tutorial not hosted on freeCodeCamp GitHub account',
          type: 'error'
        });
      });

      test('should return 400 if invalid tutorialId but is hosted on freeCodeCamp', async () => {
        const tokenResponse = await superRequest('/user/user-token', {
          method: 'POST',
          setCookies
        });
        expect(tokenResponse.status).toBe(200);
        expect(tokenResponse.body).toHaveProperty('userToken');

        const token = (tokenResponse.body as { userToken: string }).userToken;

        const response = await superRequest('/coderoad-challenge-completed', {
          method: 'POST',
          setCookies
        })
          .set('coderoad-user-token', token)
          .send({ tutorialId: 'freeCodeCamp/invalid:V1.0.0' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          msg: 'Tutorial name is not valid',
          type: 'error'
        });
      });

      test('should return 200 if tutorialId, userToken are present', async () => {
        const tokenResponse = await superRequest('/user/user-token', {
          method: 'POST',
          setCookies
        });
        expect(tokenResponse.status).toBe(200);
        expect(tokenResponse.body).toHaveProperty('userToken');

        const token = (tokenResponse.body as { userToken: string }).userToken;

        const response = await superRequest('/coderoad-challenge-completed', {
          method: 'POST',
          setCookies
        })
          .set('coderoad-user-token', token)
          .send({
            tutorialId:
              'freeCodeCamp/learn-bash-by-building-a-boilerplate:v1.0.0'
          });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          msg: 'Successfully submitted challenge',
          type: 'success'
        });

        const user = await fastifyTestInstance.prisma.user.findFirst({
          where: { email: 'foo@bar.com' }
        });

        const challengeCompleted = user?.completedChallenges.some(challenge => {
          return challenge.id === '5ea8adfab628f68d805bfc5e';
        });

        expect(challengeCompleted).toBe(true);
      });
    });

    describe('/project-completed', () => {
      describe('validation', () => {
        it('POST rejects requests without ids', async () => {
          const response = await superRequest('/project-completed', {
            method: 'POST',
            setCookies
          }).send({});

          expect(response.body).toStrictEqual(
            isValidChallengeCompletionErrorMsg
          );
          expect(response.statusCode).toBe(400);
        });

        it('POST rejects requests without valid ObjectIDs', async () => {
          const response = await superRequest('/project-completed', {
            method: 'POST',
            setCookies
            // This is a departure from api-server, which does not require a
            // solution to give this error. However, the validator will reject
            // based on the missing solution before it gets to the invalid id.
          }).send({ id: 'not-a-valid-id', solution: '' });

          expect(response.body).toStrictEqual(
            isValidChallengeCompletionErrorMsg
          );
          expect(response.statusCode).toBe(400);
        });

        it('POST rejects requests with invalid challengeTypes', async () => {
          const response = await superRequest('/project-completed', {
            method: 'POST',
            setCookies
          }).send({
            id: id1,
            challengeType: 'not-a-valid-challenge-type',
            // TODO(Post-MVP): drop these comments, since the api-server will not
            // exist.

            // a solution is required, because otherwise the request will be
            // rejected before it gets to the challengeType validation. NOTE: this
            // is a departure from the api-server, but only in the message sent.
            solution: ''
          });

          expect(response.body).toStrictEqual(
            isValidChallengeCompletionErrorMsg
          );
          expect(response.statusCode).toBe(400);
        });

        it('POST rejects requests without solutions', async () => {
          const response = await superRequest('/project-completed', {
            method: 'POST',
            setCookies
          }).send({
            id: id1,
            challengeType: 3
          });

          expect(response.body).toStrictEqual({
            type: 'error',
            message:
              'You have not provided the valid links for us to inspect your work.'
          });
          expect(response.statusCode).toBe(400);
        });

        it('POST rejects requests with solutions that are not urls', async () => {
          const response = await superRequest('/project-completed', {
            method: 'POST',
            setCookies
          }).send({
            id: id1,
            challengeType: 3,
            solution: 'not-a-valid-solution'
          });

          expect(response.body).toStrictEqual(
            isValidChallengeCompletionErrorMsg
          );
          expect(response.statusCode).toBe(400);
        });

        it('POST rejects CodeRoad/CodeAlly projects when the user has not completed the required challenges', async () => {
          const response = await superRequest('/project-completed', {
            method: 'POST',
            setCookies
          }).send({
            id: id1, // not a codeally challenge id, but does not matter
            challengeType: 13, // this does matter, however, since there's special logic for that challenge type
            solution: 'https://any.valid/url'
          });

          expect(response.body).toStrictEqual({
            type: 'error',
            message:
              'You have to complete the project before you can submit a URL.'
          });
          // It's not really a bad request, since the client is sending a valid
          // body. It's just that the user is not allowed to do this - hence 403.
          expect(response.statusCode).toBe(403);
        });
      });

      describe('handling', () => {
        beforeEach(async () => {
          // setup: complete the challenges that codeally projects require
          await fastifyTestInstance.prisma.user.updateMany({
            where: { email: 'foo@bar.com' },
            data: {
              partiallyCompletedChallenges: [{ id: id1, completedDate: 1 }],
              completedChallenges: [],
              progressTimestamps: []
            }
          });
        });

        afterEach(async () => {
          await fastifyTestInstance.prisma.user.updateMany({
            where: { email: 'foo@bar.com' },
            data: {
              partiallyCompletedChallenges: [],
              completedChallenges: [],
              savedChallenges: []
            }
          });
        });

        it('POST accepts CodeRoad/CodeAlly projects when the user has completed the required challenges', async () => {
          const now = Date.now();
          const response = await superRequest('/project-completed', {
            method: 'POST',
            setCookies
          }).send(codeallyProject);

          const user = await fastifyTestInstance.prisma.user.findFirst({
            where: { email: 'foo@bar.com' }
          });

          expect(user).toMatchObject({
            partiallyCompletedChallenges: [],
            completedChallenges: [
              {
                ...codeallyProject,
                completedDate: expect.any(Number)
              }
            ]
          });

          const completedDate = user?.completedChallenges[0]?.completedDate;

          // TODO: use a custom matcher for this
          expect(completedDate).toBeGreaterThan(now);
          expect(completedDate).toBeLessThan(now + 1000);

          expect(response.body).toStrictEqual({
            alreadyCompleted: false,
            points: 1,
            completedDate
          });

          expect(response.statusCode).toBe(200);
        });

        it('POST accepts backend projects', async () => {
          const now = Date.now();

          const response = await superRequest('/project-completed', {
            method: 'POST',
            setCookies
          }).send(backendProject);

          const user = await fastifyTestInstance.prisma.user.findFirst({
            where: { email: 'foo@bar.com' }
          });

          expect(user).toMatchObject({
            partiallyCompletedChallenges: [partialCompletion],
            completedChallenges: [
              {
                ...backendProject,
                completedDate: expect.any(Number)
              }
            ]
          });

          const completedDate = user?.completedChallenges[0]?.completedDate;

          // TODO: use a custom matcher for this
          expect(completedDate).toBeGreaterThan(now);
          expect(completedDate).toBeLessThan(now + 1000);

          expect(response.body).toStrictEqual({
            alreadyCompleted: false,
            points: 1,
            completedDate
          });

          expect(response.statusCode).toBe(200);
        });

        it('POST correctly handles multiple requests', async () => {
          const resOriginal = await superRequest('/project-completed', {
            method: 'POST',
            setCookies
          }).send(codeallyProject);

          const resBackend = await superRequest('/project-completed', {
            method: 'POST',
            setCookies
          }).send(backendProject);

          // sending backendProject again should update its solution, but not
          // progressTimestamps or its completedDate

          const resUpdate = await superRequest('/project-completed', {
            method: 'POST',
            setCookies
          }).send({ ...codeallyProject, solution: 'https://any.other/url' });

          const user = await fastifyTestInstance.prisma.user.findFirst({
            where: { email: 'foo@bar.com' }
          });

          const expectedProgressTimestamps = user?.completedChallenges.map(
            challenge => challenge.completedDate
          );

          expect(user).toMatchObject({
            completedChallenges: [
              {
                ...codeallyProject,
                solution: 'https://any.other/url',
                completedDate: resOriginal.body.completedDate
              },
              {
                ...backendProject,
                completedDate: resBackend.body.completedDate
              }
            ],
            progressTimestamps: expectedProgressTimestamps
          });

          expect(resUpdate.body).toStrictEqual({
            alreadyCompleted: true,
            points: 2,
            completedDate: expect.any(Number)
          });

          // It should return an updated completedDate
          expect(resUpdate.body.completedDate).not.toBe(
            resOriginal.body.completedDate
          );
          expect(resUpdate.statusCode).toBe(200);
        });
      });
    });

    describe('Unauthenticated user', () => {
      let setCookies: string[];

      // Get the CSRF cookies from an unprotected route
      beforeAll(async () => {
        const res = await superRequest('/', { method: 'GET' });
        setCookies = res.get('Set-Cookie');
      });

      describe('/coderoad-challenge-completed', () => {
        test('POST returns 401 status code with error message', async () => {
          const response = await superRequest('/coderoad-challenge-completed', {
            method: 'POST',
            setCookies
          });

          expect(response?.statusCode).toBe(401);
        });
      });

      describe('/project-completed', () => {
        test('POST returns 401 status code with error message', async () => {
          const response = await superRequest('/project-completed', {
            method: 'POST',
            setCookies
          });

          expect(response?.statusCode).toBe(401);
        });
      });
    });
  });
});
