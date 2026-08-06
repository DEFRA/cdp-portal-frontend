import { fetchDeployment } from '../fetch/fetch-deployment.js'
import { nullify404 } from '../../../common/helpers/nullify-404.js'
import { provideDeploymentStatusClassname } from '../provide-deployment-status-classname.js'
import { augmentStatus } from '../augment-status.js'
import { fetchEntity } from '../../../common/helpers/fetch/fetch-entities.js'

const provideDeployment = {
  method: async function (request) {
    const deploymentId = request.params?.deploymentId
    const deployment = await fetchDeployment(deploymentId)

    const entity = await fetchEntity(deployment?.service).catch(nullify404)
    const status = augmentStatus(deployment)

    return {
      ...deployment,
      teams: entity?.teams?.filter((team) => team.teamId) ?? [],
      status,
      statusClass: provideDeploymentStatusClassname(status)
    }
  },
  assign: 'deployment'
}

export { provideDeployment }
