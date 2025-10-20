import Joi from 'joi'

import { validation } from '@defra/cdp-validation-kit/src/helpers/validation-messages.js'

function githubTeamNameValidation(buttonValue) {
  if (buttonValue === 'search') {
    return Joi.object({
      githubSearch: Joi.string().required().messages({
        'any.required': validation.enterValue,
        'string.empty': validation.enterValue
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
      'any.required': validation.enterValue,
      'string.empty': validation.enterValue
    }),
    github: Joi.when('githubSearch', {
      is: Joi.string(),
      then: Joi.string().required()
    }).messages({
      'any.required': 'Choose a team'
    }),
    button: Joi.string().valid('next'),
    redirectLocation: Joi.string().valid('summary', '')
  })
}

export { githubTeamNameValidation }
