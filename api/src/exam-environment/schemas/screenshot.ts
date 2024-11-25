import { Type } from '@fastify/type-provider-typebox';
import { STANDARD_ERROR } from '../utils/errors';

export const examEnvironmentPostScreenshot = {
  headers: Type.Object({
    'exam-environment-authorization-token': Type.String()
  }),
  response: {
    400: STANDARD_ERROR,
    500: STANDARD_ERROR
  }
};
