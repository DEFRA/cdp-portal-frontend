import { fetchDeployments } from '~/src/app/deployments/helpers/fetch-deployments'

const deploymentsController = {
  handler: async (request, h) => {
    const deployments = await fetchDeployments()

    return h.view('deployments/index', {
      pageTitle: 'Deployments',
      heading: 'Deployments',
      deployments
    })
  }
}

export { deploymentsController }
