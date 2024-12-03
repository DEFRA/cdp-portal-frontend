import Joi from 'joi'

import { validation } from '~/src/server/common/constants/validation.js'

const createPermissionValidation = Joi.object({
  value: Joi.string()
    .min(3)
    .max(53)
    .regex(/^[A-Za-z0-9]+$/)
    .required()
    .messages({
      'string.base': validation.enterValue,
      'string.empty': validation.enterValue,
      'any.required': validation.enterValue,
      'string.min': validation.minCharacters(3),
      'string.max': validation.maxCharacters(50),
      'string.pattern.base': 'Letters and numbers only'
    }),
  description: Joi.string()
    .optional()
    .allow('', null)
    .max(256)
    .messages({
      'string.max': validation.maxCharacters(256)
    })
})

export { createPermissionValidation }
