import { serviceController } from '~/src/server/services/about/controllers/service.js'
import { serviceCreateStatusController } from '~/src/server/services/about/controllers/service-create-status.js'

export const aboutService = [
  {
    method: 'GET',
    path: '/services/{serviceId}',
    ...serviceController
  },
  {
    method: 'GET',
    // TODO align this url with the other services urls: '/services/{serviceId}/create-status'
    path: '/services/create-status/{serviceId}',
    ...serviceCreateStatusController
  }
]
