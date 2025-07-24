import { fetchEntity } from './fetch/fetch-entities.js'
import { statusTagClassMap } from './status-tag-class-map.js'

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
