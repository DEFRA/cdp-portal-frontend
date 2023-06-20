import { appConfig } from '~/src/config'
import { fetchDeployment } from '~/src/server/deployments/helpers/fetch-deployment'
import { transformDeploymentToEntityDataList } from '~/src/server/deployments/transformers/transform-deployment-to-entity-data-list'

const deploymentController = {
  handler: async (request, h) => {
    const deployment = await fetchDeployment(request.params?.deploymentId)

    return h.view('deployments/views/deployment', {
      pageTitle: `${deployment.service} Service Deployment`,
      heading: deployment.service,
      deployment,
      entityDataList: transformDeploymentToEntityDataList(deployment),
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
