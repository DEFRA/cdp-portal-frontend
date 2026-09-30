import { environmentScope } from '#config/environment-scope.js'
import { entitySubTypes } from '@defra/cdp-validation-kit'
import { sortByEnv } from '#server/common/helpers/sort/sort-by-env.js'
import {
  performanceEnvironments,
  prototypeEnvironments,
  orderedEnvironments
} from '@defra/cdp-validation-kit/src/constants/environments.js'

function getEnvironmentValuesForEntitySubType(subType) {
  if (subType === entitySubTypes.prototype) {
    return prototypeEnvironments
  }

  if (subType === entitySubTypes.performance) {
    return performanceEnvironments
  }

  return orderedEnvironments
}

export function getEnvironments(userScopes, entitySubType) {
  return getEnvironmentValuesForEntitySubType(entitySubType)
    .filter((env) => {
      const scope = environmentScope[env]
      return scope == null || userScopes?.includes(scope)
    })
    .sort(sortByEnv)
}

export function getEnvironmentsThatNeed(userScopes) {
  return orderedEnvironments.filter((env) =>
    userScopes.includes(environmentScope[env])
  )
}
