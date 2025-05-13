import { validation } from '~/src/server/common/constants/validation.js'
import { checkNameAvailability } from '~/src/server/create/helpers/validator/check-name-availability.js'
import Joi from 'joi'

export const repositoryNameValidation = Joi.string()
  .min(1)
  .max(32)
  .required()
  .custom((value, helpers) => {
    if (!/^[a-z0-9-]*$/.test(value)) {
      return helpers.message(
        'Lowercase letters and numbers with hyphen separators'
      )
    } else if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(value)) {
      return helpers.message('Start and end with a letter or number')
    } else if (value.endsWith('-ddl')) {
      return helpers.message('Must not end with "-ddl"')
    } else {
      return value // Valid input
    }
  }, 'Custom repository name validation')
  .external(checkNameAvailability)
  .messages({
    'string.empty': validation.enterValue,
    'string.min': validation.minCharacters(1),
    'string.max': validation.maxCharacters(32)
  })
