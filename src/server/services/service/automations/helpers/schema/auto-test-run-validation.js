import Joi from 'joi'

import { validation } from '@defra/cdp-validation-kit/src/helpers/validation-messages.js'
import { getEnvironments } from '../../../../../common/helpers/environments/get-environments.js'
import { excludedEnvironments } from '../constants/excluded-environments.js'
import {
  envVarValueValidation,
  repositoryNameValidation
} from '@defra/cdp-validation-kit'

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
      .min(1)
      .messages({
        'any.only': 'Environment is not available for this service'
      }),
    provideProfile: Joi.boolean()
      .truthy('true')
      .falsy('false')
      .required()
      .messages({
        'any.required': 'Select whether you wish to provide a profile'
      }),
    profile: envVarValueValidation.empty('').optional(),
    newProfile: envVarValueValidation.empty('').optional()
  }).when(Joi.object({ provideProfile: Joi.valid(true, 'true') }).unknown(), {
    then: Joi.object().xor('profile', 'newProfile')
  })
}

export { autoTestRunValidation }
