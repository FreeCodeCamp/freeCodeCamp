import { format } from 'util';
import { Type } from '@fastify/type-provider-typebox';

export const ERRORS = {
  FCC_EINVAL_EXAM_ENVIRONMENT_AUTHORIZATION_TOKEN: createError(
    'FCC_EINVAL_EXAM_ENVIRONMENT_AUTHORIZATION_TOKEN',
    '%s'
  ),
  FCC_EINVAL_EXAM_ENVIRONMENT_PREREQUISITES: createError(
    'FCC_EINVAL_EXAM_ENVIRONMENT_PREREQUISITES',
    '%s'
  ),
  FCC_ENOENT_EXAM_ENVIRONMENT_MISSING_EXAM: createError(
    'FCC_ENOENT_EXAM_ENVIRONMENT_MISSING_EXAM',
    '%s'
  ),
  FCC_ERR_EXAM_ENVIRONMENT_CREATE_EXAM_ATTEMPT: createError(
    'FCC_ERR_EXAM_ENVIRONMENT_CREATE_EXAM_ATTEMPT',
    '%s'
  ),
  FCC_ERR_EXAM_ENVIRONMENT: createError('FCC_ERR_EXAM_ENVIRONMENT', '%s'),
  FCC_ENOENT_EXAM_ENVIRONMENT_AUTHORIZATION_TOKEN: createError(
    'FCC_ENOENT_EXAM_ENVIRONMENT_AUTHORIZATION_TOKEN',
    '%s'
  ),
  FCC_EINVAL_EXAM_ENVIRONMENT_EXAM_ATTEMPT: createError(
    'FCC_EINVAL_EXAM_ENVIRONMENT_EXAM_ATTEMPT',
    '%s'
  ),
  FCC_ERR_EXAM_ENVIRONMENT_EXAM_ATTEMPT: createError(
    'FCC_ERR_EXAM_ENVIRONMENT_EXAM_ATTEMPT',
    '%s'
  ),
  FCC_ENOENT_EXAM_ENVIRONMENT_GENERATED_EXAM: createError(
    'FCC_ENOENT_EXAM_ENVIRONMENT_GENERATED_EXAM',
    '%s'
  ),
  FCC_EINVAL_EXAM_ID: createError('FCC_EINVAL_EXAM_ID', '%s'),
  FCC_EINVAL_EXAM_ENVIRONMENT_SCREENSHOT: createError(
    'FCC_EINVAL_EXAM_ENVIRONMENT_SCREENSHOT',
    '%s'
  )
};

/**
 * Returns a function which optionally takes arguments to format an error message.
 * @param code - Identifier for the error.
 * @param message - Human-readable error message.
 * @returns Function which optionally takes arguments to format an error message.
 */
function createError(code: string, message: string) {
  return (...args: unknown[]) => {
    return {
      code,
      message: format(message, ...args)
    };
  };
}

export const STANDARD_ERROR = Type.Object({
  code: Type.String(),
  message: Type.String()
});
