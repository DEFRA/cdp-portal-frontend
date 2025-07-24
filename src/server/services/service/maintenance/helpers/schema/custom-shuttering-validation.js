import Joi from 'joi'

import { validation } from '../../../../../common/constants/validation.js'

const customShutteringValidation = Joi.object({
  customHtml: Joi.string().required().messages({
    'string.empty': validation.enterValue
  })
})

export { customShutteringValidation }
