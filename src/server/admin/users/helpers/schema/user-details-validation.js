import Joi from 'joi'

import { validation } from '~/src/server/common/constants/validation.js'

function userDetailsValidation(buttonValue) {
  if (buttonValue === 'skip') {
    return Joi.object({
      name: Joi.string().required().messages({
        'string.base': validation.enterValue
      }),
      defraAwsId: Joi.string().allow('', null),
      defraVpnId: Joi.string().allow('', null),
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
    defraAwsId: Joi.string().allow('', null).max(50).messages({
      'string.max': maxFiftyCharacters
    }),
    defraVpnId: Joi.string().allow('', null).max(50).messages({
      'string.max': maxFiftyCharacters
    }),
    button: Joi.string().valid('next'),
    redirectLocation: Joi.string().valid('summary', '')
  })
}

export { userDetailsValidation }
