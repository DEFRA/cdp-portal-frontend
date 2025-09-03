import Joi from 'joi'

import { validation } from '../../../../common/constants/validation.js'
import { repositoryVisibility } from '../../../constants/repository-visibility.js'
import {
  repositoryNameValidation,
  teamIdValidation
} from '@defra/cdp-validation-kit'
import { checkNameAvailability } from '../../../helpers/validator/check-name-availability.js'

function repositoryValidation() {
  return Joi.object({
    repositoryName: repositoryNameValidation.external(checkNameAvailability),
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
