import { repositoriesDecorator } from '~/src/server/common/helpers/decorators/repositories.js'
import { provideTestType } from '~/src/server/test-suites/helpers/provide-test-type.js'

function testSuiteDecorator(repositories) {
  return function addDetail({ testSuite, lastRun }) {
    const testSuiteWithRepo = repositoriesDecorator(repositories)(testSuite)

    return {
      ...testSuiteWithRepo,
      lastRun,
      testType: provideTestType(testSuiteWithRepo.topics)
    }
  }
}

export { testSuiteDecorator }
