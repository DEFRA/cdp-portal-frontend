import { config } from '~/src/config'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments'

function getEnvironmentsByTeam(teams = []) {
  const isAdmin = teams
    .map((team) => team.teamId)
    .includes(config.get('oidcAdminGroupId'))

  return getEnvironments(isAdmin)
}

export { getEnvironmentsByTeam }
