import { fetchRunningServicesById } from '~/src/server/common/helpers/fetch/fetch-running-services-by-id.js'
import { sortByEnv } from '~/src/server/common/helpers/sort/sort-by-env.js'
import { provideStatusClassname } from '~/src/server/running-services/helpers/provide-status-classname.js'

async function transformRunningServices(serviceName) {
  const runningServices = await fetchRunningServicesById(serviceName)
  const environmentsWithADeployment = [
    ...new Set(runningServices.map((rs) => rs.environment))
  ].sort(sortByEnv)

  return {
    runningServices: runningServices?.map((rs) => ({
      ...rs,
      statusClassname: provideStatusClassname(rs.status)
    })),
    environmentsWithADeployment
  }
}

export { transformRunningServices }
