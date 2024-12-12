import Joi from 'joi'

import { validation } from '~/src/server/common/constants/validation.js'

function addPermissionValidation(entityIds, buttonValue) {
  if (buttonValue === 'search') {
    return Joi.object({
      searchQuery: Joi.string().required().messages({
        'any.required': validation.enterValue,
        'string.empty': validation.enterValue
      })
    })
  }

  if (entityIds.length) {
    return Joi.object({
      searchQuery: Joi.string().allow('', null),
      entityIds: Joi.array().items(Joi.string()).single().required().messages({
        'string.base': validation.chooseAnEntry,
        'any.required': validation.chooseAnEntry
      })
    })
  }

  return Joi.object({
    searchQuery: Joi.string().required().messages({
      'any.required': validation.enterValue,
      'string.empty': validation.enterValue
    }),
    entityIds: Joi.when('searchQuery', {
      is: Joi.string(),
      then: Joi.array().items(Joi.string()).single().required()
    }).messages({
      'string.base': validation.chooseAnEntry,
      'any.required': validation.chooseAnEntry
    })
  })
}

export { addPermissionValidation }
