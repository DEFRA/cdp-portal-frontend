import Joi from 'joi'

import { validation } from '~/src/server/common/constants/validation.js'
import { repositoryVisibility } from '~/src/server/create/constants/repository-visibility.js'
import { checkNameAvailability } from '~/src/server/create/helpers/validator/check-name-availability.js'

function repositoryValidation() {
  return Joi.object({
    repositoryName: Joi.string()
      .pattern(/^[a-z0-9-]*$/)
      .pattern(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, {
        name: 'startAndEndWithCharacter'
      })
      .min(1)
      .max(32)
      .required()
      .external(checkNameAvailability)
      .messages({
        'string.empty': validation.enterValue,
        'string.pattern.base':
          'Lowercase letters and numbers with hyphen separators',
        'string.pattern.name': 'Start and end with a letter or number',
        'string.min': validation.minCharacters(1),
        'string.max': validation.maxCharacters(32)
      }),
    repositoryVisibility: Joi.string()
      .valid(...repositoryVisibility)
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
    redirectLocation: Joi.string().valid('summary', '')
  })
}

export { repositoryValidation }
