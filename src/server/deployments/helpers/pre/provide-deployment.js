import { fetchDeployment } from '../fetch/fetch-deployment.js'
import { nullify404 } from '../../../common/helpers/nullify-404.js'
import { provideDeploymentStatusClassname } from '../provide-deployment-status-classname.js'
import { augmentStatus } from '../augment-status.js'
import { fetchRepository } from '../../../common/helpers/fetch/fetch-repository.js'

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
