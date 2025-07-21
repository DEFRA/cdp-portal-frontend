import Boom from '@hapi/boom'

export function validateEntityIsAService(request, h) {
  const entity = request.app.entity ?? null

  if (
    entity === null ||
    !['Microservice', 'Prototype'].includes(entity?.type)
  ) {
    return Boom.notFound()
  }

  return h.continue
}
