import Joi from 'joi'

import { validation } from '~/src/server/common/constants/validation.js'

function serviceValidation(serviceNames, confirmServiceName) {
  const matchServiceNameValue = 'Service name value does not match'

  return Joi.object({
    serviceName: Joi.string()
      .valid(...serviceNames)
      .required()
      .messages({
        'any.only': validation.chooseAnEntry,
        'any.required': validation.chooseAnEntry,
        'string.empty': validation.chooseAnEntry
      }),
    confirmServiceName: Joi.string()
      .valid(confirmServiceName)
      .required()
      .messages({
        'any.only': matchServiceNameValue,
        'any.required': matchServiceNameValue,
        'string.empty': matchServiceNameValue
      })
  })
}

export { serviceValidation }
