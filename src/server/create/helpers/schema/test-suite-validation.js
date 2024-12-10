import Joi from 'joi'

import { validation } from '~/src/server/common/constants/validation.js'
import { checkNameAvailability } from '~/src/server/create/helpers/validator/check-name-availability.js'

function testSuiteValidation() {
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
  })
}

export { testSuiteValidation }
