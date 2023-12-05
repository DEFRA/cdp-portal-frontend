import Joi from 'joi'

import { creations } from '~/src/server/create/constants/creations'

const chooseValidation = Joi.object({
  kind: Joi.string()
    .valid(...Object.values(creations))
    .messages({
      'any.only': 'Choose an entry',
      'any.required': 'Choose an entry'
    })
    .required(),
  redirectLocation: Joi.string().valid('summary', '')
})

export { chooseValidation }
