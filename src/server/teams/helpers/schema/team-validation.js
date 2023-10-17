import Joi from 'joi'

const teamValidation = Joi.object({
  description: Joi.string().max(256).allow('', null).messages({
    'string.max': '256 characters or less'
  })
})

export { teamValidation }
