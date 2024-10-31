import Joi from 'joi'

import { creations } from '~/src/server/create/constants/creations.js'
import { validation } from '~/src/server/common/constants/validation.js'

const chooseValidation = Joi.object({
  kind: Joi.string()
    .valid(...Object.keys(creations))
    .messages({
      'any.only': validation.chooseAnEntry,
      'any.required': validation.chooseAnEntry
    })
    .required(),
  redirectLocation: Joi.string().valid('summary', '')
})

export { chooseValidation }
