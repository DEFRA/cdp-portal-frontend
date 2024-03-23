import { fetchDeployment } from '~/src/server/deployments/helpers/fetch/fetch-deployment'
import { fetchRepository } from '~/src/server/services/helpers/fetch/fetch-repository'
import { nullify404 } from '~/src/server/services/helpers/nullify-404'
import { provideDeploymentStatusClassname } from '~/src/server/deployments/helpers/provide-deployment-status-classname'

const provideDeployment = {
  method: async function (request) {
    const deploymentId = request.params?.deploymentId
    const deployment = await fetchDeployment(deploymentId)

    const github = await fetchRepository(deployment.service).catch(nullify404)
    const repository = github?.repository ?? null

    return {
      ...deployment,
      ...(repository && repository),
      statusClasses: provideDeploymentStatusClassname(deployment.status),
      isFrontend: repository?.topics?.includes('frontend') ?? false,
      isBackend: repository?.topics?.includes('backend') ?? false
    }
  },
  assign: 'deployment'
}

export { provideDeployment }
