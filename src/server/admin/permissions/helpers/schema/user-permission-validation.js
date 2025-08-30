import Joi from 'joi'
import { userIdValidation } from '@defra/cdp-validation-kit'

import { validation } from '../../../../common/constants/validation.js'

const userPermissionValidation = Joi.object({
  userId: userIdValidation,
  scopeId: Joi.objectId().required(),
  teamId: Joi.string().uuid().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional()
})

const scopeValidation = Joi.object({
  teamId: Joi.string().uuid().required().messages({
    'string.base': validation.chooseAnEntry,
    'any.required': validation.chooseAnEntry
  }),
  redirectLocation: Joi.string().valid('summary', '')
})

function userFindValidation(userId, buttonValue) {
  if (buttonValue === 'search') {
    // Fallback server side search
    return Joi.object({
      searchQuery: Joi.string().required().messages({
        'any.required': validation.enterValue,
        'string.empty': validation.enterValue
      }),
      userId: Joi.string().uuid().allow(''),
      redirectLocation: Joi.string().valid('summary', '')
    })
  }

  if (userId) {
    return Joi.object({
      searchQuery: Joi.string().allow('', null),
      userId: Joi.string().uuid().required().messages({
        'string.base': validation.chooseAnEntry,
        'any.required': validation.chooseAnEntry
      }),
      redirectLocation: Joi.string().valid('summary', '')
    })
  }

  return Joi.object({
    searchQuery: Joi.string().required().messages({
      'any.required': validation.enterValue,
      'string.empty': validation.enterValue
    }),
    userId: Joi.when('searchQuery', {
      is: Joi.string(),
      then: Joi.string().uuid().required()
    }).messages({
      'string.base': validation.chooseAnEntry,
      'any.required': validation.chooseAnEntry
    }),
    redirectLocation: Joi.string().valid('summary', '')
  })
}

export { userPermissionValidation, scopeValidation, userFindValidation }
