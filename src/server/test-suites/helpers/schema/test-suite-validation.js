import Joi from 'joi'
import { validation } from '~/src/server/common/constants/validation.js'
import { runnerProfiles } from '~/src/server/test-suites/constants/runner-profiles.js'

const chooseProfile = validation.choose('profile')
const chooseEnvironment = validation.choose('environment')

function testSuiteValidation(imageNames, environments) {
  return Joi.object({
    imageName: Joi.string()
      .valid(...imageNames)
      .required(),
    environment: Joi.string()
      .valid(...environments)
      .required()
      .messages({
        'any.only': chooseEnvironment,
        'any.required': chooseEnvironment
      }),
    profile: Joi.string()
      .valid(...Object.keys(runnerProfiles))
      .required()
      .messages({
        'any.only': chooseProfile,
        'any.required': chooseProfile
      })
  })
}

export { testSuiteValidation }
