import { unionBy } from 'lodash'

import { sortBy } from '~/src/server/common/helpers/sort-by'
import { fetchRepositories } from '~/src/server/services/helpers/fetch-repositories'
import { fetchDeployableServices } from '~/src/server/services/helpers/fetch-deployable-services'
import { transformServiceToEntityRow } from '~/src/server/services/transformers/transform-service-to-entity-row'
import { transformServiceStatusToService } from '~/src/server/services/transformers/transform-service-status-to-service'
import { fetchCreateServicesInProgressStatus } from '~/src/server/services/helpers/fetch-create-services-in-progress-status'
import { decorateServices } from '~/src/server/services/transformers/decorate-services'

const serviceListController = {
  handler: async (request, h) => {
    const { repositories } = await fetchRepositories()
    const deployableServices = await fetchDeployableServices()
    const { statuses } = await fetchCreateServicesInProgressStatus()

    const createStatusServices = statuses?.map(transformServiceStatusToService)
    const decorator = decorateServices(repositories)

    const deployableServicesWithRepository = deployableServices.map(decorator)
    const createServicesWithRepository = createStatusServices.map(decorator)

    // Services from Portal Backends /services overwrite services from Self Service Ops /create-service/status
    const services = unionBy(
      deployableServicesWithRepository,
      createServicesWithRepository,
      'serviceName'
    )

    const entityRows = services
      ?.sort(sortBy('serviceName', 'asc'))
      ?.map(transformServiceToEntityRow)

    return h.view('services/views/list', {
      pageTitle: 'Services',
      heading: 'Services',
      entityRows
    })
  }
}

export { serviceListController }
