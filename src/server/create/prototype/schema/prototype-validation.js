import Joi from 'joi'

import { validation } from '~/src/server/common/constants/validation.js'
import {
  repositoryNameValidation,
  teamIdValidation
} from '@defra/cdp-validation-kit/src/validations.js'
import { checkNameAvailability } from '~/src/server/create/helpers/validator/check-name-availability.js'

function prototypeValidation() {
  return Joi.object({
    repositoryName: repositoryNameValidation.external(checkNameAvailability),
    teamId: teamIdValidation
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
  })
}

export { prototypeValidation }
