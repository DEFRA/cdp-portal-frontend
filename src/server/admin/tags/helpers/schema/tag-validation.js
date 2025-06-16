import Joi from 'joi'

import { validation } from '~/src/server/common/constants/validation.js'
import { serviceTags } from '~/src/server/admin/tags/helpers/service-tags.js'

const serviceTagValues = Joi.string()
  .valid(...Object.keys(serviceTags))
  .required()

const tagValidation = Joi.object({
  tag: serviceTagValues.required().messages({
    'string.base': validation.chooseAnEntry,
    'any.required': validation.chooseAnEntry
  }),
  serviceId: Joi.string().min(1).required().messages({
    'string.empty': validation.chooseAnEntry,
    'any.required': validation.chooseAnEntry
  })
})

export { tagValidation, serviceTagValues }
