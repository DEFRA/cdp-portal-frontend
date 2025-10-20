import Joi from 'joi'

import { config } from '../../../../../../../config/config.js'
import {
  envVarKeyValidation,
  envVarValueValidation
} from '@defra/cdp-validation-kit'

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
function secretPayloadValidation(action, existingSecretKeys = []) {
  return Joi.object({
    secretKey: secretKeyValidation(action, existingSecretKeys),
    secretValue: envVarValueValidation,
    button: Joi.string().valid('create', 'update')
  })
}

function secretKeyValidation(action, existingSecretKeys) {
  const baseValidation = envVarKeyValidation.error(provideCustomErrorCode)

  return action === 'create'
    ? baseValidation.disallow(
        ...[...existingSecretKeys, ...platformGlobalSecretKeys]
      )
    : baseValidation.valid(...existingSecretKeys)
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
