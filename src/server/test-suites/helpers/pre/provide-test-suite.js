import { fetchEntity } from '~/src/server/common/helpers/fetch/fetch-entities.js'

async function provideEntity(request, h) {
  const entityName = request.params?.serviceId

  if (entityName) {
    request.app.entity = await fetchEntity(entityName)
  }

  return h.continue
}

const provideTestSuite = {
  method: async function (request) {
    const testSuiteId = request.params?.serviceId

    return await fetchEntity(testSuiteId)
  },
  assign: 'testSuite'
}

export { provideEntity, provideTestSuite }
