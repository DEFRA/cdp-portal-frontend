import { sortBy } from '~/src/server/common/helpers/sort/sort-by.js'
import { provideStatusClassname } from '~/src/server/running-services/helpers/provide-status-classname.js'
import { fetchRunningServices } from '~/src/server/running-services/helpers/fetch/fetch-running-services.js'

async function transformRunningServices(
  request,
  environments,
  deployableServices
) {
  const response = /** @type {Array} */ await fetchRunningServices(
    environments,
    {
      service: request.query.service,
      status: request.query.status,
      team: request.query.team,
      user: request.query.user
    }
  )

  return Object.entries(
    response?.sort(sortBy('service', 'asc')).reduce((acc, rs) => {
      if (!acc[rs.service]) {
        acc[rs.service] = { envs: {} }
      }

      acc[rs.service].envs[rs.environment] = {
        statusClassname: provideStatusClassname(rs.status),
        ...rs
      }

      if (!acc[rs.service].teams) {
        const deployableService = deployableServices.find(
          (service) =>
            service.serviceName.toLowerCase() === rs.service.toLowerCase()
        )

        acc[rs.service].teams = deployableService?.teams ?? []
      }

      return acc
    }, {})
  ).map(([serviceName, { envs, teams }]) => {
    return {
      serviceName,
      environments: envs,
      teams
    }
  })
}

export { transformRunningServices }
