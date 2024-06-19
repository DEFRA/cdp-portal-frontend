import Joi from 'joi'

import { validation } from '~/src/server/common/constants/validation'

function optionsValidation(availableInstances, availableCpu, availableMemory) {
  return Joi.object({
    instanceCount: Joi.string()
      .valid(...availableInstances.map(String))
      .required()
      .messages({
        'any.only': validation.chooseAnEntry,
        'any.required': validation.chooseAnEntry,
        'string.empty': validation.chooseAnEntry
      }),
    cpu: Joi.string()
      .valid(...availableCpu.map(String))
      .required()
      .messages({
        'any.only': validation.chooseAnEntry,
        'any.required': validation.chooseAnEntry,
        'string.empty': validation.chooseAnEntry
      }),
    memory: Joi.string()
      .valid(...availableMemory.map(String))
      .required()
      .messages({
        'any.only': validation.chooseAnEntry,
        'any.required': validation.chooseAnEntry,
        'string.empty': validation.chooseAnEntry
      }),
    redirectLocation: Joi.string().valid('summary', '')
  })
}

export { optionsValidation }
