import { allowedTerminalEnvironments } from './allowed-terminal-environments.js'
import { fetchTenantService } from '../../../../common/helpers/fetch/fetch-tenant-service.js'
import { sortByEnv } from '../../../../common/helpers/sort/sort-by-env.js'

async function getTerminalEnvs({
  serviceName,
  userScopes = [],
  entity = null
}) {
  if (!serviceName && !entity) {
    return []
  }
  const environments = allowedTerminalEnvironments({ userScopes, entity })
  const tenantService = await fetchTenantService(serviceName)

  return Object.keys(tenantService)
    .filter((env) => environments.includes(env))
    .sort(sortByEnv)
}

export { getTerminalEnvs }
