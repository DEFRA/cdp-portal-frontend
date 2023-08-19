import Joi from 'joi'

function aadIdValidation(buttonValue) {
  if (buttonValue === 'search') {
    return Joi.object({
      emailSearch: Joi.string().required().messages({
        'any.required': 'Enter value',
        'string.empty': 'Enter value'
      }),
      redirectLocation: Joi.string().valid('summary', '')
    })
  }

  return Joi.object({
    emailSearch: Joi.string().required().messages({
      'any.required': 'Enter value',
      'string.empty': 'Enter value'
    }),
    email: Joi.when('emailSearch', {
      is: Joi.string(),
      then: Joi.string().required()
    }).messages({
      'string.base': 'Choose a user',
      'any.required': 'Choose a user'
    }),
    button: Joi.string().allow('next'),
    redirectLocation: Joi.string().valid('summary', '')
  })
}

export { aadIdValidation }
