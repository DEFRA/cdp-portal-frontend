import Joi from 'joi'

import { validation } from '@defra/cdp-validation-kit/src/helpers/validation-messages.js'

function userDetailsValidation(buttonValue) {
  if (buttonValue === 'skip') {
    return Joi.object({
      name: Joi.string().required().messages({
        'string.base': validation.enterValue
      }),
      button: Joi.string().valid('skip'),
      redirectLocation: Joi.string().valid('summary', '')
    })
  }

  const maxFiftyCharacters = validation.maxCharacters(50)

  return Joi.object({
    name: Joi.string().max(50).required().messages({
      'string.max': maxFiftyCharacters,
      'string.base': validation.enterValue
    }),
    button: Joi.string().valid('next'),
    redirectLocation: Joi.string().valid('summary', '')
  })
}

export { userDetailsValidation }
