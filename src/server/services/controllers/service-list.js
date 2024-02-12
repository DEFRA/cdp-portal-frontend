import { unionBy } from 'lodash'

import { sortBy } from '~/src/server/common/helpers/sort-by'
import { fetchRepositories } from '~/src/server/services/helpers/fetch/fetch-repositories'
import { fetchDeployableServices } from '~/src/server/services/helpers/fetch/fetch-deployable-services'

import { fetchInProgress } from '~/src/server/services/helpers/fetch/fetch-in-progress'
import { transformCreateServiceStatusToService } from '~/src/server/services/transformers/transform-create-service-status-to-service'
import { repositoriesDecorator } from '~/src/server/common/helpers/decorators/repositories'
import { transformServiceToEntityRow } from '~/src/server/services/transformers/transform-service-to-entity-row'

const serviceListController = {
  handler: async (request, h) => {
    const { repositories } = await fetchRepositories()
    const deployableServices = await fetchDeployableServices()
    const { inProgress } = await fetchInProgress()

    const inProgressServices = inProgress?.map(
      transformCreateServiceStatusToService
    )
    const decorator = repositoriesDecorator(repositories)

    const deployableServicesWithRepository = deployableServices.map(decorator)

    const inProgressServicesWithRepository = inProgressServices
      .map(decorator)
      .filter((service) => service?.serviceStatus?.kind === 'microservice')
    // TODO temp filter these to only microservice,refactor once we know where the env-tests are going

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
