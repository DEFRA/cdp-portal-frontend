import Joi from 'joi'

import { validation } from '~/src/server/common/constants/validation.js'

function serviceValidation(serviceNames) {
  return Joi.object({
    serviceName: Joi.string()
      .valid(...serviceNames)
      .required()
      .messages({
        'any.only': validation.chooseAnEntry,
        'any.required': validation.chooseAnEntry,
        'string.empty': validation.chooseAnEntry
      })
  })
}

export { serviceValidation }
