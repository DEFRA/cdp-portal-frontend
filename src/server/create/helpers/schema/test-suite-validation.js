import Joi from 'joi'

import { validation } from '~/src/server/common/constants/validation.js'
import { repositoryNameValidation } from '~/src/server/common/common-validation.js'

function testSuiteValidation() {
  return Joi.object({
    repositoryName: repositoryNameValidation,
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
