import { microserviceDetailFormController } from '#server/create/microservice/controllers/detail-form.js'
import { microserviceDetailController } from '#server/create/microservice/controllers/detail.js'
import { microserviceSummaryController } from '#server/create/microservice/controllers/summary.js'
import { microserviceCreateController } from '#server/create/microservice/controllers/create.js'

export const controllersMap = {
  microservice: {
    detailForm: microserviceDetailFormController,
    detail: microserviceDetailController,
    summary: microserviceSummaryController,
    create: microserviceCreateController
  }
}
