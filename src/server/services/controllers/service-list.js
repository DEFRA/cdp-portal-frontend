import { unionBy } from 'lodash'

import { sortBy } from '~/src/server/common/helpers/sort-by'
import { fetchRepositories } from '~/src/server/services/helpers/fetch/fetch-repositories'
import { decorateServices } from '~/src/server/services/helpers/decorate-services'
import { fetchDeployableServices } from '~/src/server/services/helpers/fetch/fetch-deployable-services'
import { transformServiceToEntityRow } from '~/src/server/services/transformers/transform-service-to-entity-row'
import { fetchInProgress } from '~/src/server/services/helpers/fetch/fetch-in-progress'
import { transformCreateServiceStatusToService } from '~/src/server/services/transformers/transform-create-service-status-to-service'

const serviceListController = {
  handler: async (request, h) => {
    const { repositories } = await fetchRepositories()
    const deployableServices = await fetchDeployableServices()
    const { inProgress } = await fetchInProgress()

    const inProgressServices = inProgress?.map(
      transformCreateServiceStatusToService
    )
    const decorator = decorateServices(repositories)

    const deployableServicesWithRepository = deployableServices.map(decorator)
    const inProgressServicesWithRepository = inProgressServices.map(decorator)

    // Services from Self Service Ops /status/in-progress overwrite services from Portal Backends /services
    const services = unionBy(
      inProgressServicesWithRepository,
      deployableServicesWithRepository,
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
