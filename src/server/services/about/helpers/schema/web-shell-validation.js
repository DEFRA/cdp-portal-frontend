import Joi from 'joi'

import { validation } from '~/src/server/common/constants/validation'

function webShellValidation(environments) {
  return Joi.object({
    environment: Joi.string()
      .valid(...environments)
      .required()
      .messages({
        'any.only': validation.chooseAnEntry,
        'any.required': validation.chooseAnEntry
      })
  })
}

export { webShellValidation }
