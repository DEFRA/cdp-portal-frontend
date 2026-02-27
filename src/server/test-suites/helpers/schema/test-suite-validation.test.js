import {
  testSuiteValidation,
  testScheduleValidation
} from './test-suite-validation.js'
import daysOfTheWeek from '#server/test-suites/constants/daysOfTheWeek.js'

describe('testSuiteValidation', () => {
  const imageNames = ['suiteA']
  const environments = ['dev', 'test']

  let schema
  beforeEach(() => {
    schema = testSuiteValidation(imageNames, environments)
  })

  test('valid when provideProfile is "false" and both profile and newProfile are empty', () => {
    const input = {
      testSuite: 'suiteA',
      environment: 'dev',
      configuration: 'regular',
      provideProfile: 'false',
      profile: '',
      newProfile: ''
    }

    const { error, value } = schema.validate(input, { abortEarly: false })
    expect(error).toBeUndefined()
    expect(value.provideProfile).toBe(false)
  })

  test('valid when provideProfile is "true" and exactly one of profile or newProfile is provided', () => {
    const input = {
      testSuite: 'suiteA',
      environment: 'dev',
      configuration: 'regular',
      provideProfile: 'true',
      profile: '',
      newProfile: 'my-new-profile'
    }

    const { error, value } = schema.validate(input, { abortEarly: false })
    expect(error).toBeUndefined()
    expect(value.provideProfile).toBe(true)
  })

  test('invalid when provideProfile is "true" and both profile and newProfile are empty', () => {
    const input = {
      testSuite: 'suiteA',
      environment: 'dev',
      configuration: 'regular',
      provideProfile: 'true',
      profile: '',
      newProfile: ''
    }

    const { error } = schema.validate(input, { abortEarly: false })
    expect(error).toBeDefined()
    expect(error.details.some((d) => d.type === 'object.missing')).toBe(true)
  })

  test('invalid when provideProfile is "true" and both profile and newProfile are provided', () => {
    const input = {
      testSuite: 'suiteA',
      environment: 'dev',
      configuration: 'regular',
      provideProfile: 'true',
      profile: 'existing',
      newProfile: 'new-one'
    }

    const { error } = schema.validate(input, { abortEarly: false })
    expect(error).toBeDefined()
    expect(error.details.some((d) => d.type === 'object.xor')).toBe(true)
  })

  test('invalid when provideProfile is "true" and newProfile contains a space', () => {
    const input = {
      testSuite: 'suiteA',
      environment: 'dev',
      configuration: 'regular',
      provideProfile: 'true',
      profile: '',
      newProfile: 'new one with spaces'
    }

    const { error } = schema.validate(input, { abortEarly: false })
    expect(error).toBeDefined()
    expect(
      error.details.some(
        (d) =>
          d.context &&
          d.context.key === 'newProfile' &&
          d.type === 'string.pattern.base'
      )
    ).toBe(true)
  })

  test('invalid environment gives any.only error', () => {
    const input = {
      testSuite: 'suiteA',
      environment: 'stage', // not in environments
      configuration: 'regular',
      provideProfile: 'false',
      profile: '',
      newProfile: ''
    }

    const { error } = schema.validate(input, { abortEarly: false })
    expect(error).toBeDefined()
    expect(
      error.details.some(
        (d) =>
          d.context && d.context.key === 'environment' && d.type === 'any.only'
      )
    ).toBe(true)
  })

  test('invalid configuration gives any.only error (keys come from mocked runnerConfigurations)', () => {
    const input = {
      testSuite: 'suiteA',
      environment: 'dev',
      configuration: 'x-large', // not in { small, medium }
      provideProfile: 'false',
      profile: '',
      newProfile: ''
    }

    const { error } = schema.validate(input, { abortEarly: false })
    expect(error).toBeDefined()
    expect(
      error.details.some(
        (d) =>
          d.context &&
          d.context.key === 'configuration' &&
          d.type === 'any.only'
      )
    ).toBe(true)
  })
})

describe('testScheduleValidation', () => {
  const environments = ['dev', 'test']

  let schema
  beforeEach(() => {
    schema = testScheduleValidation(environments, daysOfTheWeek)
  })

  test('valid when provideProfile is "false" and both profile and newProfile are empty', () => {
    const input = {
      frequency: 'WEEKLY',
      daysOfTheWeek: ['tuesday', 'thursday'],
      'time-hour': 12,
      'time-minute': 30,
      environment: 'dev',
      configuration: 'regular',
      provideProfile: 'false',
      profile: '',
      newProfile: ''
    }

    const { error, value } = schema.validate(input, { abortEarly: false })
    expect(error).toBeUndefined()
    expect(value.provideProfile).toBe(false)
  })

  test('valid when provideProfile is "true" and exactly one of profile or newProfile is provided', () => {
    const input = {
      frequency: 'WEEKLY',
      daysOfTheWeek: ['tuesday', 'thursday'],
      'time-hour': 12,
      'time-minute': 30,
      environment: 'dev',
      configuration: 'regular',
      provideProfile: 'true',
      profile: '',
      newProfile: 'my-new-profile'
    }

    const { error, value } = schema.validate(input, { abortEarly: false })
    expect(error).toBeUndefined()
    expect(value.provideProfile).toBe(true)
  })

  test('invalid when provideProfile is "true" and both profile and newProfile are empty', () => {
    const input = {
      frequency: 'WEEKLY',
      daysOfTheWeek: ['tuesday', 'thursday'],
      'time-hour': 12,
      'time-minute': 30,
      environment: 'dev',
      configuration: 'regular',
      provideProfile: 'true',
      profile: '',
      newProfile: ''
    }

    const { error } = schema.validate(input, { abortEarly: false })
    expect(error).toBeDefined()
    expect(error.details.some((d) => d.type === 'object.missing')).toBe(true)
  })

  test('invalid when provideProfile is "true" and both profile and newProfile are provided', () => {
    const input = {
      frequency: 'WEEKLY',
      daysOfTheWeek: ['tuesday', 'thursday'],
      'time-hour': 12,
      'time-minute': 30,
      environment: 'dev',
      configuration: 'regular',
      provideProfile: 'true',
      profile: 'existing',
      newProfile: 'new-one'
    }

    const { error } = schema.validate(input, { abortEarly: false })
    expect(error).toBeDefined()
    expect(error.details.some((d) => d.type === 'object.xor')).toBe(true)
  })

  test('invalid when provideProfile is "true" and newProfile contains a space', () => {
    const input = {
      frequency: 'WEEKLY',
      daysOfTheWeek: ['tuesday', 'thursday'],
      'time-hour': 12,
      'time-minute': 30,
      environment: 'dev',
      configuration: 'regular',
      provideProfile: 'true',
      profile: '',
      newProfile: 'new one with spaces'
    }

    const { error } = schema.validate(input, { abortEarly: false })
    expect(error).toBeDefined()
    expect(
      error.details.some(
        (d) =>
          d.context &&
          d.context.key === 'newProfile' &&
          d.type === 'string.pattern.base'
      )
    ).toBe(true)
  })

  test('invalid environment gives any.only error', () => {
    const input = {
      frequency: 'WEEKLY',
      daysOfTheWeek: ['tuesday', 'thursday'],
      'time-hour': 12,
      'time-minute': 30,
      environment: 'stage', // not in environments
      configuration: 'regular',
      provideProfile: 'false',
      profile: '',
      newProfile: ''
    }

    const { error } = schema.validate(input, { abortEarly: false })
    expect(error).toBeDefined()
    expect(
      error.details.some(
        (d) =>
          d.context && d.context.key === 'environment' && d.type === 'any.only'
      )
    ).toBe(true)
  })

  test('invalid configuration gives any.only error (keys come from mocked runnerConfigurations)', () => {
    const input = {
      frequency: 'WEEKLY',
      daysOfTheWeek: ['tuesday', 'thursday'],
      'time-hour': 12,
      'time-minute': 30,
      environment: 'dev',
      configuration: 'x-large', // not in { small, medium }
      provideProfile: 'false',
      profile: '',
      newProfile: ''
    }

    const { error } = schema.validate(input, { abortEarly: false })
    expect(error).toBeDefined()
    expect(
      error.details.some(
        (d) =>
          d.context &&
          d.context.key === 'configuration' &&
          d.type === 'any.only'
      )
    ).toBe(true)
  })

  test('invalid daysOfTheWeek gives any.only error', () => {
    const input = {
      frequency: 'WEEKLY',
      daysOfTheWeek: ['fakeday'],
      'time-hour': 12,
      'time-minute': 30,
      environment: 'dev',
      configuration: 'regular',
      provideProfile: 'false',
      profile: '',
      newProfile: ''
    }

    const { error } = schema.validate(input, { abortEarly: false })
    expect(error).toBeDefined()
    expect(
      error.details.some(
        (d) => d.context && d.context.key === 0 && d.type === 'any.only'
      )
    ).toBe(true)
  })

  test('invalid time gives error', () => {
    const input = {
      frequency: 'WEEKLY',
      daysOfTheWeek: ['tuesday'],
      'time-hour': 120,
      'time-minute': -30,
      environment: 'dev',
      configuration: 'regular',
      provideProfile: 'false',
      profile: '',
      newProfile: ''
    }

    const { error } = schema.validate(input, { abortEarly: false })
    expect(error).toBeDefined()
    expect(
      error.details.some(
        (d) =>
          d.context && d.context.key === 'time-hour' && d.type === 'number.max'
      )
    ).toBe(true)
    expect(
      error.details.some(
        (d) =>
          d.context &&
          d.context.key === 'time-minute' &&
          d.type === 'number.min'
      )
    ).toBe(true)
  })
})
