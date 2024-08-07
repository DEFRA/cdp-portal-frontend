import Joi from 'joi'

import { config } from '~/src/config'
import { validation } from '~/src/server/common/constants/validation'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments'

/** @type {string[]} */
const platformGlobalSecretKeys = config.get('platformGlobalSecretKeys')

/** @typedef {"create" | "update"} Action */

/**
 * Provide immutable keys
 * @param {Object} Detail
 * @param {Action} action
 * @param {array} [platformFixedKeys=[]] platformFixedKeys
 * @param {array} existingSecretKeys
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
 * @param {string} teamId
 * @param {array} [existingSecretKeys=[]] existingSecretKeys
 * @returns {Joi.ObjectSchema<*>}
 */
function secretPayloadValidation(action, teamId, existingSecretKeys = []) {
  const immutableKeys = getImmutableKeys({
    action,
    platformFixedKeys: platformGlobalSecretKeys,
    existingSecretKeys
  })

  const adminTeamId = config.get('oidcAdminGroupId')
  const allowedEnvironments = Object.values(
    getEnvironments(teamId === adminTeamId)
  )

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

/**
 * Validation for secret params
 * @param params
 * @param options
 */
function secretParamsValidation(params, options) {
  const isAdmin = options.context?.auth?.credentials?.isAdmin ?? false

  const validationResult = Joi.object({
    serviceId: Joi.string().required(),
    environment: Joi.string()
      .valid(...Object.values(getEnvironments(isAdmin)))
      .required()
  }).validate(params, options)

  if (validationResult?.error) {
    throw validationResult.error
  }

  return validationResult.value
}

export { secretPayloadValidation, secretParamsValidation }

/** @import { ValidationErrorFunction, ErrorReport } from 'joi' */
