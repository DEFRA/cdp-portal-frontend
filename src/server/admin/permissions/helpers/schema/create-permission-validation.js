import Joi from 'joi'

import { validation } from '@defra/cdp-validation-kit/src/helpers/validation-messages.js'

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
  kind: Joi.array()
    .items(Joi.string())
    .has(Joi.string().valid('user', 'team', 'member'))
    .required()
    .messages({
      'array.base': validation.chooseAnEntry,
      'array.hasUnknown': validation.chooseAnEntry,
      'array.empty': validation.chooseAnEntry,
      'any.required': validation.chooseAnEntry
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
