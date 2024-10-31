import { testTypeDecorator } from '~/src/server/test-suites/helpers/decorators/test-type.js'

describe('#testTypeDecorator', () => {
  test('Should decorate with test type if environment test', () => {
    const testSuite = {
      topics: ['environment']
    }

    const result = testTypeDecorator(testSuite)

    expect(result).toEqual({
      topics: ['environment'],
      testType: 'Environment'
    })
  })

  test('Should decorate with test type if smoke test', () => {
    const testSuite = {
      topics: ['smoke']
    }

    const result = testTypeDecorator(testSuite)

    expect(result).toEqual({
      topics: ['smoke'],
      testType: 'Smoke'
    })
  })

  test('Should decorate with test type if performance test', () => {
    const testSuite = {
      topics: ['performance']
    }

    const result = testTypeDecorator(testSuite)

    expect(result).toEqual({
      topics: ['performance'],
      testType: 'Performance'
    })
  })

  test('Should decorate with test type if journey test', () => {
    const testSuite = {
      topics: ['journey']
    }

    const result = testTypeDecorator(testSuite)

    expect(result).toEqual({
      topics: ['journey'],
      testType: 'Journey'
    })
  })

  test('Should not decorate with test type if none present', () => {
    const testSuite = {
      topics: []
    }

    const result = testTypeDecorator(testSuite)

    expect(result.testType).toBeUndefined()
  })
})
