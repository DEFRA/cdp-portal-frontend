import { sortByEnv } from '../../../../common/helpers/sort/sort-by-env.js'
import { allowedBreakGlassEnvironments } from './allowed-break-glass-environments.js'

async function getTerminalEnvs({ serviceName, userScopes = [], entity }) {
  if (!serviceName && !entity) {
    return []
  }
  const environments = allowedBreakGlassEnvironments({
    userScopes,
    teams: entity.teams
  })

  return Object.keys(entity.environments)
    .filter((env) => environments.includes(env))
    .sort(sortByEnv)
}

export { getTerminalEnvs }
