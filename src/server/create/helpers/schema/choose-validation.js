import Joi from 'joi'

import { getCreations } from '~/src/server/create/constants/creations.js'
import { validation } from '~/src/server/common/constants/validation.js'

const chooseValidation = Joi.object({
  kind: Joi.string()
    .valid(
      ...Object.values(getCreations(false)).map((creation) => creation.kind)
    )
    .messages({
      'any.only': validation.chooseAnEntry,
      'any.required': validation.chooseAnEntry
    })
    .required(),
  redirectLocation: Joi.string().valid('summary', '')
})

export { chooseValidation }
