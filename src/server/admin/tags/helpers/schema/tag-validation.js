import Joi from 'joi'
import { repositoryNameValidation } from '@defra/cdp-validation-kit'

import { validation } from '../../../../common/constants/validation.js'
import { serviceTags } from '../service-tags.js'

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
