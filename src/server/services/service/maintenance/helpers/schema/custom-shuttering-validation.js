import Joi from 'joi'

import { validation } from '@defra/cdp-validation-kit/src/helpers/validation-messages.js'

const customShutteringValidation = Joi.object({
  customHtml: Joi.string().required().messages({
    'string.empty': validation.enterValue
  })
})

export { customShutteringValidation }
