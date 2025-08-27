import Joi from 'joi'

import { validation } from '../../../../../common/constants/validation.js'
import { getEnvironments } from '../../../../../common/helpers/environments/get-environments.js'
import { excludedEnvironments } from '../constants/excluded-environments.js'
import { repositoryNameValidation } from '@defra/cdp-validation-kit/src/validations.js'

// TODO
//  Validate:
//  - test suite is a test suite owned by the team that owns the service
//  - do we need messages here? Are they being used anywhere?

function autoTestRunValidation(scopes) {
  const allowedEnvironments = getEnvironments(scopes).filter(
    (env) => !excludedEnvironments.includes(env)
  )

  return Joi.object({
    serviceId: repositoryNameValidation.messages({
      'string.empty': validation.enterValue,
      'any.required': validation.enterValue
    }),
    testSuite: repositoryNameValidation.messages({
      'string.empty': validation.enterValue,
      'any.required': validation.enterValue
    }),
    environments: Joi.array()
      .items(Joi.string().valid(...allowedEnvironments))
      .messages({
        'any.only': 'Environment is not available for this service'
      })
  })
}

export { autoTestRunValidation }
