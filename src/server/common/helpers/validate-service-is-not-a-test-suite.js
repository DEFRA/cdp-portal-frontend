import Boom from '@hapi/boom'

export function validateServiceIsNotATestSuite(request, h) {
  const service = request.app.service ?? null

  if (service === null || service?.isTestSuite) {
    return Boom.notFound()
  }

  return h.continue
}
