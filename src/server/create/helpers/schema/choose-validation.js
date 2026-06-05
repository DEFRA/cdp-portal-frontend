import Joi from 'joi'

import { getCreations } from '../../constants/creations.js'
import { validation } from '@defra/cdp-validation-kit/src/helpers/validation-messages.js'

export function chooseValidation(isAdmin) {
  return Joi.object({
    kind: Joi.string()
      .valid(...getCreations(isAdmin).map((creation) => creation.value))
      .messages({
        'any.only': validation.chooseAnEntry,
        'any.required': validation.chooseAnEntry
      })
      .required(),
    redirectLocation: Joi.string().valid('summary', '')
  })
}
