import Joi from 'joi'

function userDetailsValidation(buttonValue) {
  if (buttonValue === 'skip') {
    return Joi.object({
      name: Joi.string().allow('', null),
      defraAwsId: Joi.string().allow('', null),
      defraVpnId: Joi.string().allow('', null),
      button: Joi.string().valid('skip'),
      redirectLocation: Joi.string().valid('summary', '')
    })
  }

  return Joi.object({
    name: Joi.string().allow('', null).max(50).messages({
      'string.max': '50 characters or less'
    }),
    defraAwsId: Joi.string().allow('', null).max(50).messages({
      'string.max': '50 characters or less'
    }),
    defraVpnId: Joi.string().allow('', null).max(50).messages({
      'string.max': '50 characters or less'
    }),
    button: Joi.string().valid('next'),
    redirectLocation: Joi.string().valid('summary', '')
  })
}

export { userDetailsValidation }
