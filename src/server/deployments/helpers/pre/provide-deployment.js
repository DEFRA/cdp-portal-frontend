import { fetchDeployment } from '~/src/server/deployments/helpers/fetch/fetch-deployment'
import { fetchRepository } from '~/src/server/services/helpers/fetch/fetch-repository'
import { nullify404 } from '~/src/server/services/helpers/nullify-404'
import { provideDeploymentStatusClassname } from '~/src/server/deployments/helpers/provide-deployment-status-classname'

const provideDeployment = {
  method: async function (request) {
    const deploymentId = request.params?.deploymentId
    const deployment = await fetchDeployment(deploymentId)

    const github = await fetchRepository(deployment.service).catch(nullify404)

    return {
      ...deployment,
      statusClasses: provideDeploymentStatusClassname(deployment.status),
      isFrontend: github?.repository?.topics?.includes('frontend'),
      isBackend: github?.repository?.topics?.includes('backend')
    }
  },
  assign: 'deployment'
}

export { provideDeployment }
