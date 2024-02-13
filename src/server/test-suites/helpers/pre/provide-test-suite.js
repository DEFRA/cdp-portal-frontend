import { fetchRepository } from '~/src/server/services/helpers/fetch/fetch-repository'
import { repositoryDecorator } from '~/src/server/common/helpers/decorators/repository'
import { fetchTestSuite } from '~/src/server/test-suites/helpers/fetch'

const provideTestSuite = {
  method: async function (request) {
    const testSuiteId = request.params?.serviceId

    const githubResponse = await fetchRepository(testSuiteId)
    const repository = githubResponse?.repository ?? null
    const testSuite = await fetchTestSuite(testSuiteId)

    return repositoryDecorator(testSuite, repository)
  },
  assign: 'testSuite'
}

export { provideTestSuite }
