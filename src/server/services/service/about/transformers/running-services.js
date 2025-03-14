import { provideStatusClassname } from '~/src/server/running-services/helpers/provide-status-classname.js'
import { fetchRunningServicesById } from '~/src/server/common/helpers/fetch/fetch-running-services-by-id.js'

async function transformRunningServices(serviceName) {
  const runningServices = await fetchRunningServicesById(serviceName)

  return {
    runningServices: runningServices?.map((rs) => ({
      ...rs,
      statusClassname: provideStatusClassname(rs.status)
    }))
  }
}

export { transformRunningServices }
