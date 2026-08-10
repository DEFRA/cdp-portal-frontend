import Joi from 'joi'

function githubTeamNameValidation(buttonValue) {
  if (buttonValue === 'skip') {
    return Joi.object({
      github: Joi.string().allow(''),
      button: Joi.string().valid('skip'),
      redirectLocation: Joi.string().valid('summary', '')
    })
  }

  return Joi.object({
    github: Joi.string().required().messages({
      'any.required': 'Choose a team'
    }),
    button: Joi.string().valid('next'),
    redirectLocation: Joi.string().valid('summary', '')
  })
}

export { githubTeamNameValidation }
