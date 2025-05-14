import { fetchDeployment } from '~/src/server/deployments/helpers/fetch/fetch-deployment.js'
import { nullify404 } from '~/src/server/common/helpers/nullify-404.js'
import { provideDeploymentStatusClassname } from '~/src/server/deployments/helpers/provide-deployment-status-classname.js'
import { augmentStatus } from '~/src/server/deployments/helpers/augment-status.js'
import { fetchRepository } from '~/src/server/services/helpers/fetch/fetch-repository.js'

const provideDeployment = {
  method: async function (request) {
    const deploymentId = request.params?.deploymentId
    const deployment = await fetchDeployment(deploymentId)

    const repository = await fetchRepository(deployment.service).catch(
      nullify404
    )
    const status = augmentStatus(deployment)

    return {
      ...deployment,
      ...repository,
      status,
      statusClass: provideDeploymentStatusClassname(status),
      isFrontend: repository?.topics?.includes('frontend') ?? false,
      isBackend: repository?.topics?.includes('backend') ?? false
    }
  },
  assign: 'deployment'
}

export { provideDeployment }
