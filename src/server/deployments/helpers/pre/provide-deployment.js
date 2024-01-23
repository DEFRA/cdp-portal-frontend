import { transformDeployment } from '~/src/server/deployments/transformers/transform-deployment'
import { fetchDeployment } from '~/src/server/deployments/helpers/fetch/fetch-deployment'

const provideDeployment = {
  method: async function (request) {
    const deploymentId = request.params?.deploymentId
    const deploymentResponse = await fetchDeployment(deploymentId)
    const deployment = transformDeployment(deploymentResponse)

    // If is an XHR call and when the deployment has finished and is running return null to make the poller refresh
    // the page.
    if (request.isXhr() && deployment?.status?.hasFinished) {
      return null
    }

    return deployment
  },
  assign: 'deployment'
}

export { provideDeployment }
