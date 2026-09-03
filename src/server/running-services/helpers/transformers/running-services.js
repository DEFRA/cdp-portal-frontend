import { sortBy } from '../../../common/helpers/sort/sort-by.js'
import { provideDeploymentStatusClassname } from '../provide-deployment-status-classname.js'

function transformRunningServices({
  runningServices,
  deployableServices,
  userScopes,
  decommissionedServices
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

      let deployableService
      if (!acc[rs.service].teams) {
        deployableService = [
          ...deployableServices,
          ...decommissionedServices
        ].find(
          (service) => service.name.toLowerCase() === rs.service.toLowerCase()
        )

        acc[rs.service].teams =
          deployableService?.teams.filter((team) => team.teamId) ?? []
      }

      if (!acc[rs.service].tags) {
        if (!deployableService) {
          deployableService = deployableServices.find(
            (service) => service.name.toLowerCase() === rs.service.toLowerCase()
          )
        }

        const decommissionedService = decommissionedServices.find(
          (service) => service.name.toLowerCase() === rs.service.toLowerCase()
        )

        acc[rs.service].tags = [
          ...(deployableService?.tags ?? []),
          ...(decommissionedService?.status
            ? [decommissionedService?.status.toLowerCase()]
            : [])
        ]
      }

      if (!acc[rs.service].isOwner) {
        acc[rs.service].isOwner = acc[rs.service].teams.some((team) =>
          userScopes.includes(`team:${team.teamId}`)
        )
      }

      return acc
    }, {})
  ).map(([serviceName, { envs, teams, isOwner, tags }]) => {
    return {
      serviceName,
      isOwner,
      environments: envs,
      teams,
      tags
    }
  })
}

export { transformRunningServices }
