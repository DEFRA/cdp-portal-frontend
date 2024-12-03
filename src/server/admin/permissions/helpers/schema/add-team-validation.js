import Joi from 'joi'

import { validation } from '~/src/server/common/constants/validation.js'

function addTeamValidation(teamIds, buttonValue) {
  if (buttonValue === 'search') {
    return Joi.object({
      cdpTeamQuery: Joi.string().required().messages({
        'any.required': validation.enterValue,
        'string.empty': validation.enterValue
      })
    })
  }

  if (teamIds.length) {
    return Joi.object({
      cdpTeamQuery: Joi.string().allow('', null),
      teamIds: Joi.array().items(Joi.string()).single().required().messages({
        'string.base': validation.chooseTeam,
        'any.required': validation.chooseTeam
      })
    })
  }

  return Joi.object({
    cdpTeamQuery: Joi.string().required().messages({
      'any.required': validation.enterValue,
      'string.empty': validation.enterValue
    }),
    teamIds: Joi.when('cdpTeamQuery', {
      is: Joi.string(),
      then: Joi.array().items(Joi.string()).single().required()
    }).messages({
      'string.base': validation.chooseTeam,
      'any.required': validation.chooseTeam
    })
  })
}

export { addTeamValidation }
