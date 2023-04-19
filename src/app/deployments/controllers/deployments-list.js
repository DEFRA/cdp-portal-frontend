import { fetchDeploymentsList } from '~/src/app/deployments/helpers/fetch-deployments-list'
import { sortByTimestamp } from '~/src/common/helpers/sort-by-timestamp'
import { transformDeploymentsToEntities } from '~/src/app/deployments/transformers/transform-deployments-to-entities'

const deploymentsListController = {
  handler: async (request, h) => {
    const deployments = await fetchDeploymentsList()
    const deploymentsEntityList = deployments
      .sort(sortByTimestamp())
      .map(transformDeploymentsToEntities)

    return h.view('deployments/views/deployments-list', {
      pageTitle: 'Deployments',
      heading: 'Deployments',
      items: deploymentsEntityList
    })
  }
}

export { deploymentsListController }
