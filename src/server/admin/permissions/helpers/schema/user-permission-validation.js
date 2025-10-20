import Joi from 'joi'
import { teamIdValidation, userIdValidation } from '@defra/cdp-validation-kit'

import { validation } from '@defra/cdp-validation-kit/src/helpers/validation-messages.js'

const userPermissionValidation = Joi.object({
  userId: userIdValidation,
  scopeId: Joi.objectId().required(),
  teamId: teamIdValidation,
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional()
})

const scopeValidation = Joi.object({
  teamId: teamIdValidation.messages({
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
      userId: userIdValidation.allow(''),
      redirectLocation: Joi.string().valid('summary', '')
    })
  }

  if (userId) {
    return Joi.object({
      searchQuery: Joi.string().allow('', null),
      userId: userIdValidation.messages({
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
      then: userIdValidation
    }).messages({
      'string.base': validation.chooseAnEntry,
      'any.required': validation.chooseAnEntry
    }),
    redirectLocation: Joi.string().valid('summary', '')
  })
}

export { userPermissionValidation, scopeValidation, userFindValidation }
