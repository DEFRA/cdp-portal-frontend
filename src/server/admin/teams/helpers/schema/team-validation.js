import Joi from 'joi'

import { validation } from '~/src/server/common/constants/validation'

const teamValidation = Joi.object({
  name: Joi.string()
    .max(3)
    .max(53)
    .regex(/^[A-Za-z0-9-]+$/)
    .required()
    .messages({
      'string.base': validation.enterValue,
      'string.min': validation.minCharacters(3),
      'string.max': validation.maxCharacters(50),
      'string.pattern.base': 'Letters and numbers with hyphen separators'
    }),
  description: Joi.string()
    .max(256)
    .allow('', null)
    .messages({
      'string.max': validation.maxCharacters(256)
    })
})

export { teamValidation }
