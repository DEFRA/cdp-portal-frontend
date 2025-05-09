import Boom from '@hapi/boom'

export function validateEntityIsATestSuite(request, h) {
  const entity = request.app.entity ?? null

  if (entity === null || entity?.type !== 'TestSuite') {
    return Boom.notFound()
  }

  return h.continue
}
