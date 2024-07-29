import Joi from 'joi'
import { omit } from 'lodash'

import { config, environments } from '~/src/config'
import { validation } from '~/src/server/common/constants/validation'

/** @type {string[]} */
const platformGlobalSecretKeys = config.get('platformGlobalSecretKeys')

/** @typedef {"create" | "update"} Action */

/**
 * Provide immutable keys
 * @param {Object} Detail
 * @param {Action} action
 * @param {array} [platformSecretKeys=[]] platformSecretKeys
 * @param {array} existingSecretKeys
 * @returns {string[]}
 */
const getImmutableKeys = ({
  action,
  platformSecretKeys = [],
  existingSecretKeys
}) =>
  action === 'create'
    ? [...existingSecretKeys, ...platformSecretKeys]
    : platformSecretKeys

/**
 * Provide custom error message if value is a protected platform level secret
 * @type {ValidationErrorFunction}
 * @returns {ErrorReport}
 * */
const provideCustomErrorCode = (errorReports) => {
  const errorReport = errorReports.at(0)

  if (platformGlobalSecretKeys.includes(errorReport?.value)) {
    errorReport.code = 'platform.invalid'
  }

  return errorReport
}

/**
 * Validation for Create and Update forms
 * @param {Action} action
 * @param {string} teamId
 * @param {array} [existingSecretKeys=[]] existingSecretKeys
 * @returns {Joi.ObjectSchema<*>}
 */
function secretValidation(action, teamId, existingSecretKeys = []) {
  const immutableKeys = getImmutableKeys({
    action,
    platformGlobalSecretKeys,
    existingSecretKeys
  })

  const adminTeamId = config.get('oidcAdminGroupId')
  const allowedEnvironments =
    teamId === adminTeamId
      ? Object.values(environments)
      : Object.values(omit(environments, ['management', 'infraDev']))

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
      .max(512)
      .required()
      .messages({
        'string.pattern.base': 'Should not include spaces',
        'string.min': validation.minCharacters(1),
        'string.max': validation.maxCharacters(512),
        'any.required': validation.enterValue,
        'string.empty': validation.enterValue
      }),
    teamId: Joi.string().uuid().required(),
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

export { secretValidation }

/** @import { ValidationErrorFunction, ErrorReport } from 'joi' */
