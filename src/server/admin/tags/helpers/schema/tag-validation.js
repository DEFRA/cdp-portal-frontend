import Joi from 'joi'

import { validation } from '~/src/server/common/constants/validation.js'
import { serviceTags } from '~/src/server/admin/tags/helpers/service-tags.js'
import { repositoryNameValidation } from '@defra/cdp-validation-kit/src/validations.js'

const serviceTagValues = Joi.string()
  .valid(...Object.keys(serviceTags))
  .required()

const tagValidation = Joi.object({
  tag: serviceTagValues.required().messages({
    'string.base': validation.chooseAnEntry,
    'any.required': validation.chooseAnEntry
  }),
  serviceId: repositoryNameValidation.messages({
    'string.empty': validation.chooseAnEntry,
    'any.required': validation.chooseAnEntry
  })
})

export { tagValidation, serviceTagValues }
