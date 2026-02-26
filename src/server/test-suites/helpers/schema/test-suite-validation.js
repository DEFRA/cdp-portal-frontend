import Joi from 'joi'
import { validation } from '@defra/cdp-validation-kit/src/helpers/validation-messages.js'
import { runnerConfigurations } from '../../constants/runner-configurations.js'
import { envVarValueValidation } from '@defra/cdp-validation-kit'

const chooseConfig = validation.choose('configuration')
const chooseEnvironment = validation.choose('environment')
const chooseDaysOfTheWeek = validation.choose('at least one day of the week')

export function testSuiteValidation(imageNames, environments) {
  return Joi.object({
    testSuite: Joi.string()
      .valid(...imageNames)
      .required(),
    environment: Joi.string()
      .valid(...environments)
      .required()
      .messages({
        'any.only': chooseEnvironment,
        'any.required': chooseEnvironment
      }),
    configuration: Joi.string()
      .valid(...Object.keys(runnerConfigurations))
      .required()
      .messages({
        'any.only': chooseConfig,
        'any.required': chooseConfig
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

export function testScheduleValidation(environments, daysOfTheWeek) {
  return Joi.object({
    frequency: Joi.string()
      .valid(...['WEEKLY'])
      .required(),
    hours: Joi.number().min(0).max(23).required(),
    minutes: Joi.number().min(0).max(59).required(),
    daysOfTheWeek: Joi.array()
      .items(
        Joi.string().valid(...daysOfTheWeek.map((day) => day.toLowerCase()))
      )
      .min(1)
      .messages({
        'array.min': chooseDaysOfTheWeek,
        'any.only': chooseDaysOfTheWeek
      }),
    environment: Joi.string()
      .valid(...environments)
      .required()
      .messages({
        'any.only': chooseEnvironment,
        'any.required': chooseEnvironment
      }),
    configuration: Joi.string()
      .valid(...Object.keys(runnerConfigurations))
      .required()
      .messages({
        'any.only': chooseConfig,
        'any.required': chooseConfig
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

export function postProcessValidationErrors(validationResult) {
  validationResult.error.details.forEach((detail) => {
    if (detail.type === 'object.missing' || detail.type === 'object.xor') {
      detail.path = ['profile']
      if (detail.type === 'object.missing') {
        detail.message = 'Select an existing profile or enter a new one'
      } else if (detail.type === 'object.xor') {
        detail.message =
          'Select an existing profile or enter a new one, not both'
      }
    }
  })

  const xorErrors = validationResult.error.details.filter(
    (detail) => detail.type === 'object.missing' || detail.type === 'object.xor'
  )

  xorErrors.forEach((detail) => {
    validationResult.error.details.push({
      ...detail,
      path: ['newProfile']
    })
  })
}
