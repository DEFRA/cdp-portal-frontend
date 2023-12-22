import { unionBy } from 'lodash'

import { sortBy } from '~/src/server/common/helpers/sort-by'
import { fetchUnfinished } from '~/src/server/services/helpers/fetch/fetch-unfinished'
import { fetchRepositories } from '~/src/server/services/helpers/fetch/fetch-repositories'
import { decorateServices } from '~/src/server/services/helpers/decorate-services'
import { fetchDeployableServices } from '~/src/server/services/helpers/fetch/fetch-deployable-services'
import { transformServiceToEntityRow } from '~/src/server/services/transformers/transform-service-to-entity-row'
import { transformUnfinishedToService } from '~/src/server/services/transformers/transform-unfinished-to-service'

const serviceListController = {
  handler: async (request, h) => {
    const { repositories } = await fetchRepositories()
    const deployableServices = await fetchDeployableServices()
    const { unfinished } = await fetchUnfinished()

    const unfinishedServices = unfinished?.map(transformUnfinishedToService)
    const decorator = decorateServices(repositories)

    const deployableServicesWithRepository = deployableServices.map(decorator)
    const unfinishedServicesWithRepository = unfinishedServices.map(decorator)

    // Services from Self Service Ops /status/unfinished overwrite services from Portal Backends /services
    const services = unionBy(
      unfinishedServicesWithRepository,
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
