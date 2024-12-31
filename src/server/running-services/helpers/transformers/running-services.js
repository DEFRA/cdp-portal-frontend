import { fetchRunningServices } from '~/src/server/running-services/helpers/fetch/fetch-running-services.js'
import { sortBy } from '~/src/server/common/helpers/sort/sort-by.js'
import { provideStatusClassname } from '~/src/server/running-services/helpers/provide-status-classname.js'

async function transformRunningServices(request, environments) {
  const response = /** @type {Array} */ await fetchRunningServices(
    environments,
    {
      service: request.query.service,
      status: request.query.status
    }
  )

  return Object.entries(
    response?.sort(sortBy('service', 'asc')).reduce((acc, rs) => {
      if (!acc[rs.service]) {
        acc[rs.service] = {}
      }

      acc[rs.service][rs.environment] = {
        statusClassname: provideStatusClassname(rs.status),
        ...rs
      }

      return acc
    }, {})
  ).map(([serviceName, serviceEnvironments]) => ({
    serviceName,
    environments: serviceEnvironments
  }))
}

export { transformRunningServices }
