import { faviconState } from '#server/common/constants/favicon-state.js'
import {
  taskStatus,
  testStatus
} from '#server/test-suites/constants/test-run-status.js'

export function testSuitefaviconState(testRun) {
  if (testRun.testStatus === testStatus.passed) {
    return faviconState.success
  }
  if (
    testRun.testStatus === testStatus.failed ||
    testRun.taskStatus === taskStatus.failed
  ) {
    return faviconState.failed
  }
  return faviconState.pending
}
