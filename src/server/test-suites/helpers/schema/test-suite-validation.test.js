import { testSuiteValidation } from './test-suite-validation.js'

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
