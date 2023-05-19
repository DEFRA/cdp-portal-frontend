import { fetchDeployments } from '~/src/app/deployments/helpers/fetch-deployments'
import { sortByTimestamp } from '~/src/app/common/helpers/sort-by-timestamp'
import { transformDeploymentsToEntityRow } from '~/src/app/deployments/transformers/transform-deployments-to-entity-row'

const deploymentsListController = {
  handler: async (request, h) => {
    const deployments = await fetchDeployments()
    const entityRows = deployments
      .sort(sortByTimestamp())
      .map(transformDeploymentsToEntityRow)

    return h.view('deployments/views/list', {
      pageTitle: 'Deployments',
      heading: 'Deployments',
      entityRows
    })
  }
}

export { deploymentsListController }
