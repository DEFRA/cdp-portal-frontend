import { fetchEntity } from '~/src/server/common/helpers/fetch/fetch-entities.js'
import { statusTagClassMap } from '~/src/server/common/helpers/status-tag-class-map.js'

async function provideEntity(request, h) {
  const entityName = request.params?.serviceId

  if (entityName) {
    const entity = await fetchEntity(entityName)
    entity.statusClass = statusTagClassMap(entity.status)

    request.app.entity = entity
  }

  return h.continue
}

export { provideEntity }
