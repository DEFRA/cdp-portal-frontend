import Joi from 'joi'

import { config } from '~/src/config/config.js'
import { validation } from '~/src/server/common/constants/validation.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'
import { teamIdValidation } from '@defra/cdp-validation-kit/src/validations.js'

/** @type {string[]} */
const platformGlobalSecretKeys = config.get('platformGlobalSecretKeys')

/** @typedef {"create" | "update"} Action */

/**
 * Provide immutable keys
 * @typedef {object} Options
 * @property {Action} action
 * @property {Array} [platformFixedKeys=[]] platformFixedKeys
 * @property {Array} existingSecretKeys
 * /
 /**
 * @param {Options} options
 * @returns {string[]}
 */
const getImmutableKeys = ({
  action,
  platformFixedKeys = [],
  existingSecretKeys
}) =>
  action === 'create'
    ? [...existingSecretKeys, ...platformFixedKeys]
    : platformFixedKeys

/**
 * Provide custom error message if value is a protected platform level secret
 * @type {ValidationErrorFunction}
 * @returns {ErrorReport}
 */
const provideCustomErrorCode = (errorReports) => {
  const errorReport = errorReports.at(0)

  if (platformGlobalSecretKeys?.includes(errorReport?.value)) {
    errorReport.code = 'platform.invalid'
  }

  return errorReport
}

/**
 * Validation for Create and Update forms payloads
 * @param {Action} action
 * @param {Array} [scopes]
 * @param {Array} [existingSecretKeys] existingSecretKeys
 * @returns {Joi.ObjectSchema<*>}
 */
function secretPayloadValidation(action, scopes, existingSecretKeys = []) {
  const immutableKeys = getImmutableKeys({
    action,
    platformFixedKeys: platformGlobalSecretKeys,
    existingSecretKeys
  })

  const allowedEnvironments = getEnvironments(scopes)

  return Joi.object({
    secretKey: Joi.string()
      .disallow(...immutableKeys)
      .pattern(/^\w*$/)
      .pattern(/^[a-zA-Z0-9]\w*[a-zA-Z0-9]$/, {
        name: 'startAndEndWithCharacter'
      })
      .min(1)
      .max(512)
      .required()
      .error(provideCustomErrorCode)
      .messages({
        'string.pattern.base':
          'Any case letters and numbers with underscore separators',
        'string.pattern.name': 'Start and end with a letter or number',
        'string.min': validation.minCharacters(1),
        'string.max': validation.maxCharacters(512),
        'any.invalid': 'Key already exists',
        'platform.invalid': 'Platform secrets cannot be changed',
        'any.required': validation.enterValue,
        'string.empty': validation.enterValue
      }),
    secretValue: Joi.string()
      .pattern(/^\S*$/)
      .min(1)
      .max(20000)
      .required()
      .messages({
        'string.pattern.base': 'Should not include spaces',
        'string.min': validation.minCharacters(1),
        'string.max': validation.maxCharacters(20000),
        'any.required': validation.enterValue,
        'string.empty': validation.enterValue
      }),
    teamId: teamIdValidation,
    environment: Joi.string()
      .valid(...allowedEnvironments)
      .required()
      .messages({
        'string.base': validation.choose('environment'),
        'any.only': validation.choose('environment'),
        'any.required': validation.choose('environment')
      }),
    button: Joi.string().valid('create', 'update')
  })
}

export { secretPayloadValidation }

/** @import { ValidationErrorFunction, ErrorReport } from 'joi' */
