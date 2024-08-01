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
      'string.min': validation.exactCharacters(3),
      'string.max': validation.exactCharacters(3),
      'string.pattern.base': 'Please provide uppercase 3 letters'
    }),
  description: Joi.string()
    .max(256)
    .optional()
    .messages({
      'string.max': validation.maxCharacters(256)
    })
})

export { teamValidation }
