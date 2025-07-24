import { fetchRunningServices } from '../../../common/helpers/fetch/fetch-running-services.js'
import { provideDeploymentStatusClassname } from '../provide-deployment-status-classname.js'
import { fetchEntity } from '../../../common/helpers/fetch/fetch-entities.js'

async function transformRunningService(serviceName) {
  const entity = await fetchEntity(serviceName)
  const runningServices = await fetchRunningServices(serviceName)

  return {
    runningServices: runningServices?.map((rs) => ({
      ...rs,
      statusClassname: provideDeploymentStatusClassname(rs.status)
    })),
    teams: entity?.teams?.filter((team) => team.teamId) ?? []
  }
}

export { transformRunningService }
