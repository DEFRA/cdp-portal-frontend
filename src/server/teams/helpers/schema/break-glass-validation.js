import Joi from 'joi'

import { validation } from '../../../common/constants/validation.js'

const breakGlassValidation = () => {
  const iAgree =
    'To grant break glass, agree to the statement by ticking the box'
  const minChars = 50
  const maxChars = 1000

  return Joi.object({
    reason: Joi.string()
      .min(minChars)
      .max(maxChars)
      .required()
      .messages({
        'string.min': validation.minCharacters(minChars),
        'string.max': validation.maxCharacters(maxChars),
        'string.empty': validation.enterValue,
        'any.required': validation.enterValue
      }),
    iAgree: Joi.string().valid('yes').required().messages({
      'string.base': iAgree,
      'any.required': iAgree
    })
  })
}

export { breakGlassValidation }
