import Joi from 'joi'

function addTeamValidation(buttonValue) {
  if (buttonValue === 'search') {
    return Joi.object({
      teamNameSearch: Joi.string().required().messages({
        'any.required': 'Enter value',
        'string.empty': 'Enter value'
      }),
      redirectLocation: Joi.string().valid('summary', '')
    })
  }

  if (buttonValue === 'skip') {
    return Joi.object({
      teamNameSearch: Joi.string().allow(''),
      teams: Joi.string().allow(''),
      button: Joi.string().valid('skip'),
      redirectLocation: Joi.string().valid('summary', '')
    })
  }

  return Joi.object({
    teamNameSearch: Joi.string().required().messages({
      'any.required': 'Enter value',
      'string.empty': 'Enter value'
    }),
    teams: Joi.when('teamNameSearch', {
      is: Joi.string(),
      then: Joi.array().items(Joi.string()).single().required()
    }).messages({
      'array.base': 'Choose a team/s',
      'string.base': 'Choose a team/s',
      'any.required': 'Choose a team/s'
    }),
    button: Joi.string().allow('next'),
    redirectLocation: Joi.string().valid('summary', '')
  })
}

export { addTeamValidation }
