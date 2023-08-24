import Joi from 'joi'

const teamValidation = Joi.object({
  name: Joi.string()
    .max(3)
    .max(53)
    .regex(/^[A-Za-z0-9-]+$/)
    .required()
    .messages({
      'string.base': 'Enter a value',
      'string.min': '3 characters or more',
      'string.max': '50 characters or less',
      'string.pattern.base': 'Letters and numbers with hyphen separators'
    }),
  description: Joi.string().max(256).allow('', null).messages({
    'string.max': '256 characters or less'
  })
})

export { teamValidation }
