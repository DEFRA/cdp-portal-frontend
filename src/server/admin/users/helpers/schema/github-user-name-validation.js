import Joi from 'joi'

function githubUserNameValidation(buttonValue) {
  if (buttonValue === 'search') {
    return Joi.object({
      githubSearch: Joi.string().required().messages({
        'any.required': 'Enter value',
        'string.empty': 'Enter value'
      }),
      redirectLocation: Joi.string().valid('summary', '')
    })
  }

  if (buttonValue === 'skip') {
    return Joi.object({
      githubSearch: Joi.string().allow(''),
      github: Joi.string().allow(''),
      button: Joi.string().valid('skip'),
      redirectLocation: Joi.string().valid('summary', '')
    })
  }

  return Joi.object({
    githubSearch: Joi.string().required().messages({
      'any.required': 'Enter value',
      'string.empty': 'Enter value'
    }),
    github: Joi.when('githubSearch', {
      is: Joi.string(),
      then: Joi.string().required()
    }).messages({
      'any.required': 'Choose a user'
    }),
    button: Joi.string().valid('next'),
    redirectLocation: Joi.string().valid('summary', '')
  })
}

export { githubUserNameValidation }
