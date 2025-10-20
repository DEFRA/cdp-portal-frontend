import Joi from 'joi'
import {
  repositoryNameValidation,
  teamIdValidation
} from '@defra/cdp-validation-kit'

import { checkNameAvailability } from '../validator/check-name-availability.js'
import { validation } from '@defra/cdp-validation-kit/src/helpers/validation-messages.js'

function createTenantPayloadValidation(allowedTemplates) {
  return Joi.object({
    repositoryName: repositoryNameValidation.external(checkNameAvailability),
    serviceTypeTemplate: Joi.string()
      .valid(...allowedTemplates.map((t) => t.id))
      .messages({
        'any.only': validation.chooseAnEntry,
        'any.required': validation.chooseAnEntry
      })
      .required(),
    teamId: teamIdValidation.required(),
    templateTag: Joi.string()
      .pattern(/^[a-zA-Z0-9][a-zA-Z0-9-_\\.]*[a-zA-Z0-9]$/)
      .allow('')
      .messages({
        'string.pattern.base':
          'Branch or tag name: Alphanumeric characters, fullstops, underscores & hyphens only'
      })
      .optional()
  }).unknown(true)
}

export { createTenantPayloadValidation }
