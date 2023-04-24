import { fetchDeployments } from '~/src/app/deployments/helpers/fetch-deployments'
import { sortByTimestamp } from '~/src/common/helpers/sort-by-timestamp'
import { transformDeploymentToEntityRow } from '~/src/app/deployments/transformers/transform-deployment-to-entity-row'

const deploymentsListController = {
  handler: async (request, h) => {
    const deployments = await fetchDeployments()
    const entityRows = deployments
      .sort(sortByTimestamp())
      .map(transformDeploymentToEntityRow)

    return h.view('deployments/views/deployments-list', {
      pageTitle: 'Deployments',
      heading: 'Deployments',
      entityRows
    })
  }
}

export { deploymentsListController }
