import Joi from 'joi'

import { validation } from '../../../common/constants/validation.js'

function dbChangeValidation(
  serviceNames,
  migrations,
  environments,
  buttonValue
) {
  // Without clientside js, fallback search
  if (buttonValue === 'search') {
    return Joi.object({
      serviceName: Joi.string()
        .valid(...serviceNames)
        .required()
        .messages({
          'any.only': validation.chooseAnEntry,
          'any.required': validation.chooseAnEntry,
          'string.empty': validation.chooseAnEntry
        }),
      version: Joi.string().allow(null, ''),
      environment: Joi.string()
        .valid(...environments)
        .allow(null, ''),
      button: Joi.string().valid('search'),
      redirectLocation: Joi.string().valid('summary', '')
    })
  }

  return Joi.object({
    serviceName: Joi.string()
      .valid(...serviceNames)
      .required()
      .messages({
        'any.only': validation.chooseAnEntry,
        'any.required': validation.chooseAnEntry,
        'string.empty': validation.chooseAnEntry
      }),
    version: Joi.string()
      .valid(...migrations)
      .required()
      .messages({
        'any.valid': validation.chooseAnEntry,
        'any.only': validation.chooseAnEntry,
        'any.required': validation.chooseAnEntry,
        'string.empty': validation.chooseAnEntry // If image name not provided, available versions is an empty array
      }),
    environment: Joi.string()
      .valid(...environments)
      .required()
      .messages({
        'any.only': validation.chooseAnEntry,
        'any.required': validation.chooseAnEntry
      }),
    button: Joi.string().valid('next', 'save'),
    redirectLocation: Joi.string().valid('summary', '')
  })
}

export { dbChangeValidation }
