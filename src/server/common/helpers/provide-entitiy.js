import { fetchEntity } from '~/src/server/common/helpers/fetch/fetch-entities.js'

async function provideEntity(request, h) {
  const entityName = request.params?.serviceId

  if (entityName) {
    request.app.entity = await fetchEntity(entityName)
  }

  return h.continue
}

export { provideEntity }
