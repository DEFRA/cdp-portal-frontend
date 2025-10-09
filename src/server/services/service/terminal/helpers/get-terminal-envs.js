import { fetchTenantService } from '../../../../common/helpers/fetch/fetch-tenant-service.js'
import { sortByEnv } from '../../../../common/helpers/sort/sort-by-env.js'
import { allowedBreakGlassEnvironments } from './allowed-break-glass-environments.js'

async function getTerminalEnvs({
  serviceName,
  userScopes = [],
  entity = null
}) {
  if (!serviceName && !entity) {
    return []
  }
  const environments = allowedBreakGlassEnvironments({
    userScopes,
    teams: entity.teams
  })
  const tenantService = await fetchTenantService(serviceName)

  return Object.keys(tenantService)
    .filter((env) => environments.includes(env))
    .sort(sortByEnv)
}

export { getTerminalEnvs }
