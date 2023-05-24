import { fetchDeployments } from '~/src/app/deployments/helpers/fetch-deployments'
import { sortBy } from '~/src/common/helpers/sort-by'
import { transformDeploymentsToEntityRow } from '~/src/app/deployments/transformers/transform-deployments-to-entity-row'

const deploymentsListController = {
  handler: async (request, h) => {
    const deployments = await fetchDeployments()
    const entityRows = deployments
      ?.sort(sortBy('timestamp'))
      ?.map(transformDeploymentsToEntityRow)

    return h.view('deployments/views/list', {
      pageTitle: 'Deployments',
      heading: 'Deployments',
      entityRows
    })
  }
}

export { deploymentsListController }
