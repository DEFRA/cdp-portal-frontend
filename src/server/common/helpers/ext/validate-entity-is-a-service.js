import Boom from '@hapi/boom'
import { entityTypes } from '@defra/cdp-validation-kit'

export function validateEntityIsAService(request, h) {
  const entity = request.app.entity ?? null

  if (entity === null || entity?.type !== entityTypes.microservice) {
    return Boom.notFound()
  }

  return h.continue
}
