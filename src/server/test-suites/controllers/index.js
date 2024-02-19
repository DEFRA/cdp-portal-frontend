import { testSuiteController } from '~/src/server/test-suites/controllers/test-suite'
import { testSuiteListController } from '~/src/server/test-suites/controllers/test-suite-list'
import { testSuiteStatusController } from '~/src/server/test-suites/controllers/test-suite-status'
import { testSuiteResultsController } from '~/src/server/test-suites/controllers/test-suite-results'
import { triggerTestSuiteRunController } from '~/src/server/test-suites/controllers/trigger-test-suite-run'

export {
  testSuiteController,
  testSuiteListController,
  testSuiteStatusController,
  triggerTestSuiteRunController,
  testSuiteResultsController
}
