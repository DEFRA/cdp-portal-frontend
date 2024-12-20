import Boom from '@hapi/boom'

import { toService } from '~/src/server/services/secrets/transformers/to-service.js'

async function provideService(request, h) {
  const serviceId = request.params?.serviceId

  if (serviceId) {
    const service = await toService(serviceId)
    const isTestSuite =
      service && service?.isFrontend === false && service?.isBackend === false

    if (isTestSuite) {
      return Boom.notFound()
    }

    request.app.service = service
  }

  return h.continue
}

export { provideService }
