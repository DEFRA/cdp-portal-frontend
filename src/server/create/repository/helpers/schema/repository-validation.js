import Joi from 'joi'

import { validation } from '~/src/server/common/constants/validation.js'
import { repositoryVisibility } from '~/src/server/create/constants/repository-visibility.js'
import {
  repositoryNameValidation,
  teamIdValidation
} from '@defra/cdp-validation-kit/src/validations.js'

function repositoryValidation() {
  return Joi.object({
    repositoryName: repositoryNameValidation,
    repositoryVisibility: Joi.string()
      .valid(...repositoryVisibility)
      .messages({
        'any.only': validation.chooseAnEntry,
        'any.required': validation.chooseAnEntry
      })
      .required(),
    teamId: teamIdValidation
      .messages({
        'any.required': validation.chooseAnEntry
      })
      .required(),
    redirectLocation: Joi.string().valid('summary', '')
  })
}

export { repositoryValidation }
