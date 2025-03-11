import Boom from '@hapi/boom'

export function validateServiceIsNotATestSuite(request, h) {
  const service = request.app.service

  if (service === null || service?.isTestSuite) {
    return Boom.notFound()
  }

  return h.continue
}
