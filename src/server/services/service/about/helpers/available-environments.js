import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'
import { sortByEnv } from '~/src/server/common/helpers/sort/sort-by-env.js'

function availableEnvironments({ userScopes, tenantServiceInfo, entityType }) {
  const environments = getEnvironments(userScopes, entityType)

  return Object.keys(tenantServiceInfo)
    .filter((e) => environments.includes(e))
    .sort(sortByEnv)
}

export { availableEnvironments }
