import Joi from 'joi'

import { config } from '../../../../../../../config/config.js'
import { validation } from '../../../../../constants/validation.js'

/** @type {string[]} */
const platformGlobalSecretKeys = config.get('platformGlobalSecretKeys')

/** @typedef {"create" | "update"} Action */

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
 * @param {Array} [existingSecretKeys] existingSecretKeys
 * @returns {Joi.ObjectSchema<*>}
 */
function secretPayloadValidation(action, existingSecretKeys) {
  return Joi.object({
    secretKey: secretKeyValidation(action, existingSecretKeys),
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
    button: Joi.string().valid('create', 'update')
  })
}

function secretKeyValidation(action, existingSecretKeys) {
  const rulesWithKeys =
    action === 'create'
      ? Joi.string().disallow(
          ...[...existingSecretKeys, ...platformGlobalSecretKeys]
        )
      : Joi.string().valid(...existingSecretKeys)

  return rulesWithKeys
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
    })
}

/**
 * Validation for remove forms payloads
 * @param {Array} [existingSecretKeys] existingSecretKeys
 * @returns {Joi.ObjectSchema<*>}
 */
function removeSecretPayloadValidation(existingSecretKeys) {
  return Joi.object({
    secretKey: secretKeyValidation('remove', existingSecretKeys)
  })
}

export { secretPayloadValidation, removeSecretPayloadValidation }

/** @import { ValidationErrorFunction, ErrorReport } from 'joi' */
