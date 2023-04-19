import { fetchDeploymentsList } from '~/src/app/deployments/helpers/fetch-deployments-list'

const deploymentsListController = {
  handler: async (request, h) => {
    const deployments = await fetchDeploymentsList()

    return h.view('deployments/views/deployments-list', {
      pageTitle: 'Deployments',
      heading: 'Deployments',
      deployments
    })
  }
}

export { deploymentsListController }
