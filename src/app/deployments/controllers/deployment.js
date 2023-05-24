import { appConfig } from '~/src/config'
import { fetchDeployment } from '~/src/app/deployments/helpers/fetch-deployment'
import { transformDeploymentToHeadingEntities } from '~/src/app/deployments/transformers/transform-deployment-to-heading-entities'

const deploymentController = {
  handler: async (request, h) => {
    const deployment = await fetchDeployment(request.params?.deploymentId)

    return h.view('deployments/views/deployment', {
      pageTitle: `${deployment.service} Service Deployment`,
      heading: deployment.service,
      deployment,
      headingEntities: transformDeploymentToHeadingEntities(deployment),
      breadcrumbs: [
        {
          text: 'Deployments',
          href: `${appConfig.get('appPathPrefix')}/deployments`
        },
        {
          text: deployment.service
        }
      ]
    })
  }
}

export { deploymentController }
