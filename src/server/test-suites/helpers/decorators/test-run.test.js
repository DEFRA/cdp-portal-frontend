import { testRunDecorator } from '~/src/server/test-suites/helpers/decorators/test-run'

describe('#testRunDecorator', () => {
  const serviceName = 'random-environment-test'
  const testSuite = {
    serviceName
  }

  test('Should decorate with last test run', () => {
    const testRuns = [
      {
        created: '1994-01-05'
      },
      {
        created: '2020-06-11'
      },
      {
        created: '2015-06-01'
      }
    ]

    const result = testRunDecorator(testSuite, testRuns)

    expect(result.lastRun).toBeDefined()
    expect(result.lastRun).toBe('2020-06-11')
  })

  test('Should not decorate if no test runs', () => {
    const testRuns = []

    const result = testRunDecorator(testSuite, testRuns)

    expect(result.lastRun).toBeUndefined()
  })
})
