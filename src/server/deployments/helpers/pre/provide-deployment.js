import { fetchDeployment } from '~/src/server/deployments/helpers/fetch/fetch-deployment'

const provideDeployment = {
  method: async function (request) {
    const deploymentId = request.params?.deploymentId
    return await fetchDeployment(deploymentId)
  },
  assign: 'deployment'
}

export { provideDeployment }
