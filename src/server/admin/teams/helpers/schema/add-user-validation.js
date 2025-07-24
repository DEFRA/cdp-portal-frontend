import Joi from 'joi'

import { validation } from '../../../../common/constants/validation.js'

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
        'string.base': validation.chooseUser,
        'any.required': validation.chooseUser
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
      'string.base': validation.chooseUser,
      'any.required': validation.chooseUser
    })
  })
}

export { addUserValidation }
