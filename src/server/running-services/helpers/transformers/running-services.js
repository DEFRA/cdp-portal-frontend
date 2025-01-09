import { sortBy } from '~/src/server/common/helpers/sort/sort-by.js'
import { provideStatusClassname } from '~/src/server/running-services/helpers/provide-status-classname.js'

function transformRunningServices(
  runningServices,
  deployableServices,
  userScope
) {
  return Object.entries(
    runningServices?.sort(sortBy('service', 'asc')).reduce((acc, rs) => {
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

        acc[rs.service].teams =
          deployableService?.teams.filter((team) => team.teamId) ?? []
      }

      if (!acc[rs.service].userOwnsService) {
        acc[rs.service].userOwnsService = acc[rs.service].teams.some((team) =>
          userScope.includes(team.teamId)
        )
      }

      return acc
    }, {})
  ).map(([serviceName, { envs, teams, userOwnsService }]) => {
    return {
      serviceName,
      userOwnsService,
      environments: envs,
      teams
    }
  })
}

export { transformRunningServices }
