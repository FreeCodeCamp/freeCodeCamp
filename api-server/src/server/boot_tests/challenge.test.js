import { find } from 'lodash';

import {
  buildUserUpdate,
  buildChallengeUrl,
  createChallengeUrlResolver,
  createRedirectToCurrentChallenge,
  getFirstChallenge,
  isValidChallengeCompletion,
  validateChallenge,
  validateProject,
  ensureObjectContainsAllProperties,
  hasProperties,
  challengesCompleted,
  projectCompleted,
  expectedProjectStructures
} from '../boot/challenge';

import {
  firstChallengeUrl,
  requestedChallengeUrl,
  mockAllChallenges,
  mockChallenge,
  mockUser,
  mockGetFirstChallenge,
  mockCompletedChallenge,
  mockCompletedChallengeNoFiles,
  mockCompletedChallenges,
  projectPayloads,
  projectPayloadsIncorrectStructure
} from './fixtures';

export const mockReq = opts => {
  const req = {};
  return { ...req, ...opts };
};

export const mockRes = opts => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  res.set = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  return { ...res, ...opts };
};

describe('boot/challenge', () => {
  xdescribe('validateChallenge', () => {
    it('', () => {
      validateChallenge();
    });
  });
  xdescribe('validateProject', () => {
    it('', () => {
      validateProject();
    });
  });
  describe('ensureObjectContainsAllFields', () => {
    it('should return true if object contains all fields', () => {
      for (const project of projectPayloads) {
        expect(
          ensureObjectContainsAllProperties(
            project,
            expectedProjectStructures[project.challengeType]
          )
        ).toBe(true);
      }
    });
    it('should return false if object does not contain all fields', () => {
      for (const project of projectPayloadsIncorrectStructure) {
        expect(
          ensureObjectContainsAllProperties(
            project,
            expectedProjectStructures[project.challengeType]
          )
        ).toBe(false);
      }
    });
  });
  describe('hasFields', () => {
    const exampleObj = {
      a: '',
      b: null,
      c: [
        {
          d: 0,
          e: () => {}
        }
      ],
      f: {
        g: {
          h: 2
        }
      }
    };
    const exampleFields = ['a', 'b', 'c.d', 'c.e', 'f.g.h'];
    it('should return true if object has all fields', () => {
      for (const field of exampleFields) {
        expect(hasProperties(exampleObj, field)).toBe(true);
      }
    });
    it('should return false if object does not have all fields', () => {
      for (const field of ['a.b', 'b.c', 'g', 'f.g.h.i', 'b.a']) {
        expect(hasProperties(exampleObj, field)).toBe(false);
        expect(hasProperties(exampleObj, field)).toBe(false);
        expect(hasProperties(exampleObj, field)).toBe(false);
      }
    });
  });
  xdescribe('challengesCompleted', () => {
    it('', () => {
      challengesCompleted();
    });
  });
  xdescribe('projectCompleted', () => {
    it('', () => {
      projectCompleted();
    });
  });

  describe('buildUserUpdate', () => {
    it('returns an Object with a nested "completedChallenges" property', () => {
      const result = buildUserUpdate(
        mockUser,
        '123abc',
        mockCompletedChallenge,
        'UTC'
      );
      expect(result).toHaveProperty('updateData.$push.completedChallenges');
    });

    // eslint-disable-next-line max-len
    it('preserves file contents if the completed challenge is a JS Project', () => {
      const jsChallengeId = 'aa2e6f85cab2ab736c9a9b24';
      const completedChallenge = {
        ...mockCompletedChallenge,
        completedDate: Date.now(),
        id: jsChallengeId
      };
      const result = buildUserUpdate(
        mockUser,
        jsChallengeId,
        completedChallenge,
        'UTC'
      );
      const newCompletedChallenge = result.updateData.$push.completedChallenges;

      expect(newCompletedChallenge).toEqual(completedChallenge);
    });

    it('preserves the original completed date of a challenge', () => {
      const completedChallengeId = 'aaa48de84e1ecc7c742e1124';
      const completedChallenge = {
        ...mockCompletedChallenge,
        completedDate: Date.now(),
        id: completedChallengeId
      };
      const originalCompletion = find(
        mockCompletedChallenges,
        x => x.id === completedChallengeId
      ).completedDate;
      const result = buildUserUpdate(
        mockUser,
        completedChallengeId,
        completedChallenge,
        'UTC'
      );

      const updatedCompletedChallenge =
        result.updateData.$set['completedChallenges.2'];

      expect(updatedCompletedChallenge.completedDate).toEqual(
        originalCompletion
      );
    });

    // eslint-disable-next-line max-len
    it('does not attempt to update progressTimestamps for a previously completed challenge', () => {
      const completedChallengeId = 'aaa48de84e1ecc7c742e1124';
      const completedChallenge = {
        ...mockCompletedChallenge,
        completedDate: Date.now(),
        id: completedChallengeId
      };
      const { updateData } = buildUserUpdate(
        mockUser,
        completedChallengeId,
        completedChallenge,
        'UTC'
      );

      const hasProgressTimestamps =
        '$push' in updateData && 'progressTimestamps' in updateData.$push;
      expect(hasProgressTimestamps).toBe(false);
    });

    // eslint-disable-next-line max-len
    it('provides a progressTimestamps update for new challenge completion', () => {
      expect.assertions(2);
      const { updateData } = buildUserUpdate(
        mockUser,
        '123abc',
        mockCompletedChallenge,
        'UTC'
      );
      expect(updateData).toHaveProperty('$push');
      expect(updateData.$push).toHaveProperty('progressTimestamps');
    });

    it('will $push newly completed challenges to the completedChallenges array', () => {
      const {
        updateData: {
          $push: { completedChallenges }
        }
      } = buildUserUpdate(
        mockUser,
        '123abc',
        mockCompletedChallengeNoFiles,
        'UTC'
      );

      expect(completedChallenges).toEqual(mockCompletedChallengeNoFiles);
    });
  });

  describe('buildChallengeUrl', () => {
    it('resolves the correct Url for the provided challenge', () => {
      const result = buildChallengeUrl(mockChallenge);

      expect(result).toEqual(requestedChallengeUrl);
    });
  });

  describe('challengeUrlResolver', () => {
    it('resolves to the first challenge url by default', async () => {
      const challengeUrlResolver = await createChallengeUrlResolver(
        mockAllChallenges,
        {
          _getFirstChallenge: mockGetFirstChallenge
        }
      );

      return challengeUrlResolver().then(url => {
        expect(url).toEqual(firstChallengeUrl);
      });
    }, 10000);

    // eslint-disable-next-line max-len
    it('returns the first challenge url if the provided id does not relate to a challenge', async () => {
      const challengeUrlResolver = await createChallengeUrlResolver(
        mockAllChallenges,
        {
          _getFirstChallenge: mockGetFirstChallenge
        }
      );

      return challengeUrlResolver('not-a-real-challenge').then(url => {
        expect(url).toEqual(firstChallengeUrl);
      });
    });

    it('resolves the correct url for the requested challenge', async () => {
      const challengeUrlResolver = await createChallengeUrlResolver(
        mockAllChallenges,
        {
          _getFirstChallenge: mockGetFirstChallenge
        }
      );

      return challengeUrlResolver('123abc').then(url => {
        expect(url).toEqual(requestedChallengeUrl);
      });
    });
  });

  describe('getFirstChallenge', () => {
    it('returns the correct challenge url from the model', async () => {
      const result = await getFirstChallenge(mockAllChallenges);

      expect(result).toEqual(firstChallengeUrl);
    });

    it('returns the learn base if no challenges found', async () => {
      const result = await getFirstChallenge([]);

      expect(result).toEqual('/learn');
    });
  });

  describe('isValidChallengeCompletion', () => {
    const validObjectId = '5c716d1801013c3ce3aa23e6';

    it('declares a 403 for an invalid id in the body', () => {
      expect.assertions(2);
      const req = mockReq({
        body: { id: 'not-a-real-id' }
      });
      const res = mockRes();
      const next = jest.fn();

      isValidChallengeCompletion(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it('declares a 403 for an invalid challengeType in the body', () => {
      expect.assertions(2);
      const req = mockReq({
        body: { id: validObjectId, challengeType: 'ponyfoo' }
      });
      const res = mockRes();
      const next = jest.fn();

      isValidChallengeCompletion(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it('declares a 403 for an invalid solution in the body', () => {
      expect.assertions(2);
      const req = mockReq({
        body: {
          id: validObjectId,
          challengeType: '1',
          solution: 'https://not-a-url'
        }
      });
      const res = mockRes();
      const next = jest.fn();

      isValidChallengeCompletion(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it('calls next if the body is valid', () => {
      const req = mockReq({
        body: {
          id: validObjectId,
          challengeType: '1',
          solution: 'https://www.freecodecamp.org'
        }
      });
      const res = mockRes();
      const next = jest.fn();

      isValidChallengeCompletion(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('calls next if only the id is provided', () => {
      const req = mockReq({
        body: {
          id: validObjectId
        }
      });
      const res = mockRes();
      const next = jest.fn();

      isValidChallengeCompletion(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('can handle an "int" challengeType', () => {
      const req = mockReq({
        body: {
          id: validObjectId,
          challengeType: 1
        }
      });
      const res = mockRes();
      const next = jest.fn();

      isValidChallengeCompletion(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('redirectToCurrentChallenge', () => {
    const mockHomeLocation = 'https://www.example.com';
    const mockLearnUrl = `${mockHomeLocation}/learn`;
    const mockgetParamsFromReq = () => ({
      returnTo: mockLearnUrl,
      origin: mockHomeLocation,
      pathPrefix: ''
    });
    const mockNormalizeParams = params => params;

    it('redirects to the learn base url for non-users', async () => {
      const redirectToCurrentChallenge = createRedirectToCurrentChallenge(
        () => {},
        mockNormalizeParams,
        mockgetParamsFromReq
      );
      const req = mockReq();
      const res = mockRes();
      const next = jest.fn();
      await redirectToCurrentChallenge(req, res, next);

      expect(res.redirect).toHaveBeenCalledWith(mockLearnUrl);
    });

    // eslint-disable-next-line max-len
    it('redirects to the url provided by the challengeUrlResolver', async () => {
      const challengeUrlResolver = await createChallengeUrlResolver(
        mockAllChallenges,
        {
          _getFirstChallenge: mockGetFirstChallenge
        }
      );
      const expectedUrl = `${mockHomeLocation}${requestedChallengeUrl}`;
      const redirectToCurrentChallenge = createRedirectToCurrentChallenge(
        challengeUrlResolver,
        mockNormalizeParams,
        mockgetParamsFromReq
      );
      const req = mockReq({
        user: mockUser
      });
      const res = mockRes();
      const next = jest.fn();
      await redirectToCurrentChallenge(req, res, next);

      expect(res.redirect).toHaveBeenCalledWith(expectedUrl);
    });

    // eslint-disable-next-line max-len
    it('redirects to the first challenge for users without a currentChallengeId', async () => {
      const challengeUrlResolver = await createChallengeUrlResolver(
        mockAllChallenges,
        {
          _getFirstChallenge: mockGetFirstChallenge
        }
      );
      const redirectToCurrentChallenge = createRedirectToCurrentChallenge(
        challengeUrlResolver,
        mockNormalizeParams,
        mockgetParamsFromReq
      );
      const req = mockReq({
        user: { ...mockUser, currentChallengeId: '' }
      });
      const res = mockRes();
      const next = jest.fn();
      await redirectToCurrentChallenge(req, res, next);
      const expectedUrl = `${mockHomeLocation}${firstChallengeUrl}`;
      expect(res.redirect).toHaveBeenCalledWith(expectedUrl);
    });
  });
});
