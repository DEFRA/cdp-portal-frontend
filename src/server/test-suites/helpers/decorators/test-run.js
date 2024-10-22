import { sortBy } from '~/src/server/common/helpers/sort/sort-by'
import { fetchTestRuns } from '~/src/server/test-suites/helpers/fetch/fetch-test-runs'

async function testRunDecorator(testSuite) {
  const testRuns = await fetchTestRuns(testSuite.serviceName)
  if (!testRuns || testRuns.length === 0) {
    return testSuite
  }
  const orderedTestRuns = testRuns.sort(sortBy('created', 'desc'))
  return {
    ...testSuite,
    lastRun: orderedTestRuns[0]
  }
}

export { testRunDecorator }
