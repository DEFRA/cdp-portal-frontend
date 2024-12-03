import Joi from 'joi'

import { validation } from '~/src/server/common/constants/validation.js'

const editPermissionValidation = Joi.object({
  description: Joi.string()
    .optional()
    .allow('', null)
    .max(256)
    .messages({
      'string.max': validation.maxCharacters(256)
    })
})

export { editPermissionValidation }
