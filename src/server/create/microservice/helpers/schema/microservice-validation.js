import Joi from 'joi'

import { validation } from '@defra/cdp-validation-kit/src/helpers/validation-messages.js'
import { repositoryNameValidation } from '@defra/cdp-validation-kit'
import { checkNameAvailability } from '../../../helpers/validator/check-name-availability.js'

function microserviceValidation(templateIds) {
  return Joi.object({
    microserviceName: repositoryNameValidation.external(checkNameAvailability),
    serviceTypeTemplateId: Joi.string()
      .valid(...templateIds)
      .messages({
        'any.only': validation.chooseAnEntry,
        'any.required': validation.chooseAnEntry
      })
      .required(),
    teamId: Joi.string()
      .messages({
        'any.required': validation.chooseAnEntry
      })
      .required(),
    templateTag: Joi.string()
      .pattern(/^[a-zA-Z0-9][a-zA-Z0-9-_\\.]*[a-zA-Z0-9]$/)
      .allow('')
      .messages({
        'string.pattern.base':
          'Branch or tag name: Alphanumeric characters, fullstops, underscores & hyphens only'
      })
      .optional(),
    redirectLocation: Joi.string().valid('summary', '')
  }).unknown(true)
}

export { microserviceValidation }
