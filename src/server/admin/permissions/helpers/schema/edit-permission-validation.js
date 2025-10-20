import Joi from 'joi'

import { validation } from '@defra/cdp-validation-kit/src/helpers/validation-messages.js'

const editPermissionValidation = Joi.object({
  kind: Joi.array()
    .items(Joi.string())
    .has(Joi.string().valid('user', 'team', 'member'))
    .required()
    .messages({
      'array.base': validation.chooseAnEntry,
      'array.hasUnknown': validation.chooseAnEntry,
      'array.empty': validation.chooseAnEntry,
      'any.required': validation.chooseAnEntry
    }),
  description: Joi.string()
    .optional()
    .allow('', null)
    .max(256)
    .messages({
      'string.max': validation.maxCharacters(256)
    })
})

export { editPermissionValidation }
