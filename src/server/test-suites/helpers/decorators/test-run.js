import { sortBy } from '~/src/server/common/helpers/sort/sort-by'

function testRunDecorator(testSuite, testRuns) {
  if (!testRuns || testRuns.length === 0) {
    return testSuite
  }
  const orderedTestRuns = testRuns.sort(sortBy('created', 'desc'))
  return {
    ...testSuite,
    lastRun: orderedTestRuns[0].created
  }
}

export { testRunDecorator }
