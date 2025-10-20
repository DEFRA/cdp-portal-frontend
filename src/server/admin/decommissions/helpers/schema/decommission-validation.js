import Joi from 'joi'

import { validation } from '@defra/cdp-validation-kit/src/helpers/validation-messages.js'

function decommissionValidation(repositoryNames) {
  return Joi.object({
    repositoryName: Joi.string()
      .valid(...repositoryNames)
      .required()
      .messages({
        'any.only': validation.chooseAnEntry,
        'any.required': validation.chooseAnEntry,
        'string.empty': validation.chooseAnEntry
      })
  })
}

export { decommissionValidation }
