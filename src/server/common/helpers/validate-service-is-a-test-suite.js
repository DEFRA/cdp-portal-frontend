import Boom from '@hapi/boom'

export function validateServiceIsATestSuite(request, h) {
  const service = request.app.service

  if (!service?.isTestSuite) {
    return Boom.notFound()
  }

  return h.continue
}
