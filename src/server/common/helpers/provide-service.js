import { toService } from '~/src/server/common/helpers/to-service.js'

async function provideService(request, h) {
  const serviceId = request.params?.serviceId

  if (serviceId) {
    request.app.service = await toService(serviceId)
  }

  return h.continue
}

export { provideService }
