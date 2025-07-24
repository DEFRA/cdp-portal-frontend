import { fetchEntity } from '../../../common/helpers/fetch/fetch-entities.js'

const provideTestSuite = {
  method: async function (request) {
    const testSuiteId = request.params?.serviceId

    return await fetchEntity(testSuiteId)
  },
  assign: 'testSuite'
}

export { provideTestSuite }
