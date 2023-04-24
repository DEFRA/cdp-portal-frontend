import { fetchDeployment } from '~/src/app/deployments/helpers/fetch-deployment'
import { transformDeploymentToHeadingEntities } from '~/src/app/deployments/transformers/transform-deployment-to-heading-entities'

const deploymentController = {
  handler: async (request, h) => {
    const deployment = await fetchDeployment(request.params?.deploymentId)

    return h.view('deployments/views/deployment', {
      pageTitle: `${deployment.serviceName} Deployment`,
      heading: deployment.serviceName,
      deployment,
      headingEntities: transformDeploymentToHeadingEntities(deployment),
      breadcrumbs: [
        {
          text: 'Deployments',
          href: '/cdp-portal-frontend/deployments'
        },
        {
          text: deployment.serviceName
        }
      ]
    })
  }
}

export { deploymentController }
