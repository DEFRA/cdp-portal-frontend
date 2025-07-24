import { microserviceDetailController } from './controllers/detail.js'
import { microserviceDetailFormController } from './controllers/detail-form.js'
import { microserviceSummaryController } from './controllers/summary.js'
import { microserviceCreateController } from './controllers/create.js'

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
