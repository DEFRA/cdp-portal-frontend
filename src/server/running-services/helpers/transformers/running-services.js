import { sortBy } from '../../../common/helpers/sort/sort-by.js'
import { provideDeploymentStatusClassname } from '../provide-deployment-status-classname.js'

export function transformRunningServices({
  runningServices,
  deployableServices,
  decommissionedServices,
  userScopes
}) {
  // Filter out decommissioned services
  const activeServices = runningServices.filter(
    (rs) =>
      !decommissionedServices?.some(
        (service) => service.name.toLowerCase() === rs.service.toLowerCase()
      )
  )

  return Object.entries(
    activeServices?.sort(sortBy('service', 'asc')).reduce((acc, rs) => {
      if (!acc[rs.service]) {
        acc[rs.service] = { envs: {} }
      }

      acc[rs.service].envs[rs.environment] = {
        statusClassname: provideDeploymentStatusClassname(rs.status),
        ...rs
      }

      let deployableService
      if (!acc[rs.service].teams) {
        deployableService = deployableServices?.find(
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

        acc[rs.service].tags = deployableService?.tags ?? []
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
