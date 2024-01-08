import {
  microserviceCreateController,
  microserviceDetailController,
  microserviceDetailFormController,
  microserviceSummaryController
} from '~/src/server/create/microservice/controllers'

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
