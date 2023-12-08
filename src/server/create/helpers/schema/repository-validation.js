import Joi from 'joi'

import { repositoryVisibility } from '~/src/server/create/constants/repository-visibility'
import { checkNameAvailability } from '~/src/server/create/helpers/validator/check-name-availability'

function repositoryValidation() {
  return Joi.object({
    repositoryName: Joi.string()
      .pattern(/^[\w-]*$/)
      .pattern(/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/, {
        name: 'startAndEndWithCharacter'
      })
      .min(1)
      .max(32)
      .required()
      .external(checkNameAvailability)
      .messages({
        'string.empty': 'Enter value',
        'string.pattern.base': 'Letters and numbers with hyphen separators',
        'string.pattern.name': 'Start and end with a character',
        'string.min': '1 character or more',
        'string.max': '32 characters or less'
      }),
    repositoryVisibility: Joi.string()
      .valid(...repositoryVisibility)
      .messages({
        'any.only': 'Choose an entry',
        'any.required': 'Choose an entry'
      })
      .required(),
    teamId: Joi.string()
      .messages({
        'any.required': 'Choose an entry'
      })
      .required(),
    redirectLocation: Joi.string().valid('summary', '')
  })
}

export { repositoryValidation }
