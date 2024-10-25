import { repositoryDecorator } from '~/src/server/common/helpers/decorators/repository'
import { fetchTestSuite } from '~/src/server/test-suites/helpers/fetch'
import { fetchRepository } from '~/src/server/services/helpers/fetch/fetch-repository'

const provideTestSuite = {
  method: async function (request) {
    const testSuiteId = request.params?.serviceId

    const githubResponse = await fetchRepository(testSuiteId)
    const repository = githubResponse?.repository ?? null

    // this is not handling a 404. As a 404 is not json
    const testSuite = await fetchTestSuite(testSuiteId)

    return repositoryDecorator(testSuite, repository)
  },
  assign: 'testSuite'
}

export { provideTestSuite }
