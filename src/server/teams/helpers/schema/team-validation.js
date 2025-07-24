import Joi from 'joi'

import { validation } from '../../../common/constants/validation.js'

const teamValidation = Joi.object({
  description: Joi.string()
    .max(256)
    .allow('', null)
    .messages({
      'string.max': validation.maxCharacters(256)
    })
})

export { teamValidation }
