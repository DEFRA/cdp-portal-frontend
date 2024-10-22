import { fetchTestRuns } from '~/src/server/test-suites/helpers/fetch/fetch-test-runs'
import { testRunDecorator } from '~/src/server/test-suites/helpers/decorators/test-run'

async function testRunsDecorator(testSuite) {
  const testRuns = await fetchTestRuns(testSuite.serviceName)
  return testRunDecorator(testSuite, testRuns)
}

export { testRunsDecorator }
