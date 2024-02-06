import { transformDeployment } from '~/src/server/deployments/transformers/transform-deployment'
import { fetchDeployment } from '~/src/server/deployments/helpers/fetch/fetch-deployment'

const provideDeployment = {
  method: async function (request) {
    const deploymentId = request.params?.deploymentId
    const deploymentResponse = await fetchDeployment(deploymentId)

    return transformDeployment(deploymentResponse)
  },
  assign: 'deployment'
}

export { provideDeployment }
