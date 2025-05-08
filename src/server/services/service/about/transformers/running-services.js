import { provideDeploymentStatusClassname } from '~/src/server/running-services/helpers/provide-deployment-status-classname.js'
import { fetchRunningServices } from '~/src/server/common/helpers/fetch/fetch-running-services.js'

async function transformRunningServices(serviceName) {
  const runningServices = await fetchRunningServices(serviceName)

  return {
    runningServices: runningServices?.map((rs) => ({
      ...rs,
      statusClassname: provideDeploymentStatusClassname(rs.status)
    }))
  }
}

export { transformRunningServices }
