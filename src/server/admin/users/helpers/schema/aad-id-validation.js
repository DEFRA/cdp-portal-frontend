import Joi from 'joi'

import { validation } from '@defra/cdp-validation-kit/src/helpers/validation-messages.js'

function aadIdValidation(buttonValue) {
  if (buttonValue === 'search') {
    return Joi.object({
      aadQuery: Joi.string().required().messages({
        'any.required': validation.enterValue,
        'string.empty': validation.enterValue
      }),
      redirectLocation: Joi.string().valid('summary', '')
    })
  }

  return Joi.object({
    aadQuery: Joi.string().required().messages({
      'any.required': validation.enterValue,
      'string.empty': validation.enterValue
    }),
    email: Joi.when('aadQuery', {
      is: Joi.string(),
      then: Joi.string().required()
    }).messages({
      'string.base': validation.chooseUser,
      'any.required': validation.chooseUser
    }),
    button: Joi.string().allow('next'),
    redirectLocation: Joi.string().valid('summary', '')
  })
}

export { aadIdValidation }
