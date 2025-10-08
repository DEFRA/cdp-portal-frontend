import { getEnvironments } from '../../../../common/helpers/environments/get-environments.js'
import { sortByEnv } from '../../../../common/helpers/sort/sort-by-env.js'

function availableEnvironments({
  userScopes,
  tenantServiceInfo,
  entitySubType
}) {
  const environments = getEnvironments(userScopes, entitySubType)

  return Object.keys(tenantServiceInfo)
    .filter((e) => environments.includes(e))
    .sort(sortByEnv)
}

export { availableEnvironments }
