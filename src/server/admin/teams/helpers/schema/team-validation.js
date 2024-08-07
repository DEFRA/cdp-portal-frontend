import Joi from 'joi'

import { validation } from '~/src/server/common/constants/validation'

const teamValidation = Joi.object({
  name: Joi.string()
    .min(3)
    .max(53)
    .regex(/^[A-Za-z0-9-]+$/)
    .required()
    .messages({
      'string.base': validation.enterValue,
      'any.required': validation.enterValue,
      'string.min': validation.minCharacters(3),
      'string.max': validation.maxCharacters(50),
      'string.pattern.base': 'Letters and numbers with hyphen separators'
    }),
  serviceCode: Joi.string()
    .optional()
    .min(3)
    .max(3)
    .regex(/^[A-Z]+$/)
    .messages({
      'string.min': validation.exactLetters(3),
      'string.max': validation.exactLetters(3),
      'string.pattern.base': 'Provide 3 uppercase letters'
    }),
  description: Joi.string()
    .max(256)
    .optional()
    .messages({
      'string.max': validation.maxCharacters(256)
    })
})

export { teamValidation }
