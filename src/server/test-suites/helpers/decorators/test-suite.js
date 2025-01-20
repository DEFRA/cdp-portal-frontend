import { repositoriesDecorator } from '~/src/server/common/helpers/decorators/repositories.js'
import { provideTestType } from '~/src/server/test-suites/helpers/provide-test-type.js'

function testSuiteDecorator(repositories, userScopeUUIDs) {
  const decorator = repositoriesDecorator(repositories)

  return ({ testSuite, lastRun }) => {
    const testSuiteWithRepo = decorator(testSuite)

    return {
      ...testSuiteWithRepo,
      lastRun,
      testType: provideTestType(testSuiteWithRepo.topics),
      isOwner: testSuiteWithRepo?.teams.some((team) =>
        userScopeUUIDs.includes(team.teamId)
      )
    }
  }
}

export { testSuiteDecorator }
