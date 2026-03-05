import Joi from 'joi'
import { validation } from '@defra/cdp-validation-kit/src/helpers/validation-messages.js'
import { runnerConfigurations } from '../../constants/runner-configurations.js'
import { envVarValueValidation } from '@defra/cdp-validation-kit'

const chooseConfig = validation.choose('configuration')
const chooseEnvironment = validation.choose('environment')
const chooseDaysOfTheWeek = 'Choose at least one day of the week'
const chooseTime = 'Enter a time between 00:00 and 23:59'
const chooseDate = 'Enter a valid date'

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
    'time-hour': Joi.number().integer().min(0).max(23).messages({
      'number.base': chooseTime,
      'number.min': chooseTime,
      'number.max': chooseTime
    }),
    'time-minute': Joi.number().integer().min(0).max(59).messages({
      'number.base': chooseTime,
      'number.min': chooseTime,
      'number.max': chooseTime
    }),
    daysOfTheWeek: Joi.array()
      .items(
        Joi.string().valid(...daysOfTheWeek.map((day) => day.toLowerCase()))
      )
      .required()
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
    newProfile: envVarValueValidation.empty('').optional(),
    enabled: Joi.boolean().optional(),
    'startDate-day': Joi.number().integer().min(1).max(31).optional().messages({
      'number.base': chooseDate,
      'number.min': chooseDate,
      'number.max': chooseDate
    }),
    'startDate-month': Joi.number()
      .integer()
      .min(1)
      .max(12)
      .optional()
      .messages({
        'number.base': chooseDate,
        'number.min': chooseDate,
        'number.max': chooseDate
      }),
    'startDate-year': Joi.number().integer().min(1970).optional().messages({
      'number.base': chooseDate,
      'number.min': chooseDate
    }),
    'endDate-day': Joi.number().integer().min(1).max(31).optional().messages({
      'number.base': chooseDate,
      'number.min': chooseDate,
      'number.max': chooseDate
    }),
    'endDate-month': Joi.number().integer().min(1).max(12).optional().messages({
      'number.base': chooseDate,
      'number.min': chooseDate,
      'number.max': chooseDate
    }),
    'endDate-year': Joi.number().integer().min(1970).optional().messages({
      'number.base': chooseDate,
      'number.min': chooseDate
    })
  })
    .and('endDate-day', 'endDate-month', 'endDate-year')
    .when(Joi.object({ provideProfile: Joi.valid(true, 'true') }).unknown(), {
      then: Joi.object().xor('profile', 'newProfile')
    })
    .custom((value, helpers) => {
      if (
        value['startDate-year'] &&
        value['startDate-month'] &&
        value['startDate-day']
      ) {
        const startDate = validDate(
          value['startDate-year'],
          value['startDate-month'],
          value['startDate-day']
        )
        if (!startDate) {
          return helpers.error('startDate.invalid')
        }

        if (
          value['endDate-year'] &&
          value['endDate-month'] &&
          value['endDate-day']
        ) {
          const endDate = validDate(
            value['endDate-year'],
            value['endDate-month'],
            value['endDate-day']
          )
          if (!endDate) {
            return helpers.error('endDate.invalid')
          }

          if (endDate.getTime() <= startDate.getTime()) {
            return helpers.error('endDate.beforeStartDate')
          }
        }
      }

      return value
    })
}

export function postProcessValidationErrors(validationResult) {
  validationResult.error.details.forEach((detail) => {
    // Profile
    if (detail.type === 'object.missing' || detail.type === 'object.xor') {
      detail.path = ['profile']
      if (detail.type === 'object.missing') {
        detail.message = 'Select an existing profile or enter a new one'
      } else if (detail.type === 'object.xor') {
        detail.message =
          'Select an existing profile or enter a new one, not both'
      }
    }

    // Date
    if (detail.type === 'object.and') {
      detail.path = detail.context.missing
      detail.message = chooseDate
    }

    // startDate
    if (detail.type === 'startDate.invalid') {
      detail.path = ['startDate-year', 'startDate-month', 'startDate-day']
      detail.message = chooseDate
    }

    // endDate
    if (detail.type === 'endDate.invalid') {
      detail.path = ['endDate-year', 'endDate-month', 'endDate-day']
      detail.message = chooseDate
    }

    if (detail.type === 'endDate.beforeStartDate') {
      detail.path = ['endDate-year', 'endDate-month', 'endDate-day']
      detail.message = 'Date must be after the Start Date'
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

function validDate(year, month, day) {
  const date = new Date(year, month - 1, day)

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null
  }

  return date
}
