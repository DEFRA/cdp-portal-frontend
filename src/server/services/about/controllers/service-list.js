import unionBy from 'lodash/unionBy.js'

import { sortBy } from '~/src/server/common/helpers/sort/sort-by.js'
import { fetchRepositories } from '~/src/server/common/helpers/fetch/fetch-repositories.js'
import { fetchDeployableServices } from '~/src/server/services/helpers/fetch/fetch-deployable-services.js'
import { fetchInProgress } from '~/src/server/services/helpers/fetch/fetch-in-progress.js'
import { createServiceStatusToService } from '~/src/server/common/transformers/create-service-status-to-service.js'
import { repositoriesDecorator } from '~/src/server/common/helpers/decorators/repositories.js'
import { serviceToEntityRow } from '~/src/server/services/about/transformers/service-to-entity-row.js'

const serviceListController = {
  handler: async (request, h) => {
    const { repositories } = await fetchRepositories()
    const deployableServices = await fetchDeployableServices()
    const { inProgress } = await fetchInProgress()

    const inProgressServices = inProgress?.map(createServiceStatusToService)
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
      ?.map(serviceToEntityRow)

    return h.view('services/about/views/list', {
      pageTitle: 'Services',
      heading: 'Services',
      entityRows
    })
  }
}

export { serviceListController }
