import { fetchRunningServicesById } from '~/src/server/common/helpers/fetch/fetch-running-services-by-id.js'
import { provideStatusClassname } from '~/src/server/running-services/helpers/provide-status-classname.js'
import { fetchDeployableService } from '~/src/server/common/helpers/fetch/fetch-deployable-service.js'

async function transformRunningService(serviceName) {
  const deployableService = await fetchDeployableService(serviceName)
  const runningServices = await fetchRunningServicesById(serviceName)

  return {
    runningServices: runningServices?.map((rs) => ({
      ...rs,
      statusClassname: provideStatusClassname(rs.status)
    })),
    teams: deployableService?.teams ?? []
  }
}

export { transformRunningService }
