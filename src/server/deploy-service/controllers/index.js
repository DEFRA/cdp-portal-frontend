import { availableVersionsController } from '~/src/server/deploy-service/controllers/available-versions'
import { availableMemoryController } from '~/src/server/deploy-service/controllers/available-memory'
import { deploymentController } from '~/src/server/deploy-service/controllers/form/deployment'
import { startDeployServiceController } from '~/src/server/deploy-service/controllers/form/start-deploy-service'
import { optionsFormController } from '~/src/server/deploy-service/controllers/form/options-form'
import { optionsController } from '~/src/server/deploy-service/controllers/form/options'
import { detailsController } from '~/src/server/deploy-service/controllers/form/details'
import { detailsFormController } from '~/src/server/deploy-service/controllers/form/details-form'
import { summaryController } from '~/src/server/deploy-service/controllers/form/summary'
import { deployController } from '~/src/server/deploy-service/controllers/form/deploy'

export {
  availableVersionsController,
  availableMemoryController,
  startDeployServiceController,
  detailsController,
  detailsFormController,
  optionsController,
  optionsFormController,
  summaryController,
  deployController,
  deploymentController
}
