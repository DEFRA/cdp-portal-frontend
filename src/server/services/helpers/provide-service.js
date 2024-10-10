import { toService } from '~/src/server/services/secrets/transformers/to-service'

async function provideService(request, h) {
  const serviceId = request.params?.serviceId

  if (serviceId) {
    request.app.service = await toService(serviceId)
  }

  return h.continue
}

export { provideService }
