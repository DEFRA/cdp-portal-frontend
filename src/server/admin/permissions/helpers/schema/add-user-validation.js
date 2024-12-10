import Joi from 'joi'

import { validation } from '~/src/server/common/constants/validation.js'

function addUserValidation(userIds, buttonValue) {
  if (buttonValue === 'search') {
    return Joi.object({
      cdpUserQuery: Joi.string().required().messages({
        'any.required': validation.enterValue,
        'string.empty': validation.enterValue
      })
    })
  }

  if (userIds.length) {
    return Joi.object({
      cdpUserQuery: Joi.string().allow('', null),
      userIds: Joi.array().items(Joi.string()).single().required().messages({
        'string.base': validation.chooseTeam,
        'any.required': validation.chooseTeam
      })
    })
  }

  return Joi.object({
    cdpUserQuery: Joi.string().required().messages({
      'any.required': validation.enterValue,
      'string.empty': validation.enterValue
    }),
    userIds: Joi.when('cdpUserQuery', {
      is: Joi.string(),
      then: Joi.array().items(Joi.string()).single().required()
    }).messages({
      'string.base': validation.chooseTeam,
      'any.required': validation.chooseTeam
    })
  })
}

export { addUserValidation }
