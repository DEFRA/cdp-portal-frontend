import { sortBy } from '~/src/server/common/helpers/sort/sort-by.js'
import { provideDeploymentStatusClassname } from '~/src/server/running-services/helpers/provide-deployment-status-classname.js'

function transformRunningServices({
  runningServices,
  deployableServices,
  userScopeUUIDs
}) {
  return Object.entries(
    runningServices?.sort(sortBy('service', 'asc')).reduce((acc, rs) => {
      if (!acc[rs.service]) {
        acc[rs.service] = { envs: {} }
      }

      acc[rs.service].envs[rs.environment] = {
        statusClassname: provideDeploymentStatusClassname(rs.status),
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

      if (!acc[rs.service].isOwner) {
        acc[rs.service].isOwner = acc[rs.service].teams.some((team) =>
          userScopeUUIDs.includes(team.teamId)
        )
      }

      return acc
    }, {})
  ).map(([serviceName, { envs, teams, isOwner }]) => {
    return {
      serviceName,
      isOwner,
      environments: envs,
      teams
    }
  })
}

export { transformRunningServices }
