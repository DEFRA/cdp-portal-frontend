import { microserviceDetailController } from '~/src/server/create/microservice/controllers/detail.js'
import { microserviceDetailFormController } from '~/src/server/create/microservice/controllers/detail-form.js'
import { microserviceSummaryController } from '~/src/server/create/microservice/controllers/summary.js'
import { microserviceCreateController } from '~/src/server/create/microservice/controllers/create.js'

const createMicroserviceRoutes = [
  {
    method: 'GET',
    path: '/create/microservice/detail',
    ...microserviceDetailFormController
  },
  {
    method: 'POST',
    path: '/create/microservice/detail',
    ...microserviceDetailController
  },
  {
    method: 'GET',
    path: '/create/microservice/summary',
    ...microserviceSummaryController
  },
  {
    method: 'POST',
    path: '/create/microservice',
    ...microserviceCreateController
  }
]

export { createMicroserviceRoutes }
