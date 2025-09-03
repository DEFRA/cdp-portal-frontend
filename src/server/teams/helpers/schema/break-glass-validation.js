import Joi from 'joi'

import { validation } from '../../../common/constants/validation.js'

const breakGlassValidation = (hasReadTsAndCs) => {
  const completedComplianceRequirements =
    'To proceed complete all compliance requirements'
  const iAgree =
    'To grant break glass, agree to the statement by ticking the box'
  const minChars = 26
  const maxChars = 1000

  const baseValidation = {
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
    complianceRequirements: Joi.string().valid('yes').required().messages({
      'any.only': completedComplianceRequirements
    }),
    iAgree: Joi.string().valid('yes').optional()
  }

  if (!hasReadTsAndCs) {
    return Joi.object({
      ...baseValidation,
      iAgree: Joi.string().valid('yes').optional()
    })
  }

  return Joi.object({
    ...baseValidation,
    iAgree: Joi.string().valid('yes').required().messages({
      'string.base': iAgree,
      'any.required': iAgree
    })
  })
}

export { breakGlassValidation }
