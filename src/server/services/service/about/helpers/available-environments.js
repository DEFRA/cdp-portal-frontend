import { getEnvironments } from '../../../../common/helpers/environments/get-environments.js'
import { sortByEnv } from '../../../../common/helpers/sort/sort-by-env.js'

function availableEnvironments({ userScopes, entity }) {
  const environments = getEnvironments(userScopes, entity.subType)

  return Object.keys(entity.environments)
    .filter((e) => environments.includes(e))
    .sort(sortByEnv)
}

export { availableEnvironments }
