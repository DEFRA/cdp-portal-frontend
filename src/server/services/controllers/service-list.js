import { omit } from 'lodash'

import { fetchRepositories } from '~/src/server/common/helpers/fetch-repositories'
import { sortBy } from '~/src/server/common/helpers/sort-by'
import { transformServiceToEntityRow } from '~/src/server/services/transformers/transform-service-to-entity-row'
import { fetchDeployableServices } from '~/src/server/services/helpers/fetch-deployable-services'

const serviceListController = {
  handler: async (request, h) => {
    const { repositories } = await fetchRepositories()
    const deployableServices = await fetchDeployableServices()

    const services = deployableServices.map((service) => {
      const repositoryDetail = repositories.find(
        (repository) => repository.url === service.githubUrl
      )

      return omit(
        {
          ...service,
          ...repositoryDetail
        },
        ['url']
      )
    })

    const entityRows = services
      ?.sort(sortBy('id', 'asc'))
      ?.map(transformServiceToEntityRow)

    return h.view('services/views/list', {
      pageTitle: 'Services',
      heading: 'Services',
      entityRows
    })
  }
}

export { serviceListController }
