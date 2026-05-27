import {
  environments,
  performanceEnvironments,
  prototypeEnvironments
} from '#config/environments.js'
import { entitySubTypes } from '@defra/cdp-validation-kit'
import { sortByEnv } from '#server/common/helpers/sort/sort-by-env.js'

function getEnvironmentValuesForEntitySubType(subType) {
  if (subType === entitySubTypes.prototype) {
    return prototypeEnvironments
  }

  if (subType === entitySubTypes.performance) {
    return performanceEnvironments
  }

  return Object.values(environments)
}

function getEnvironments(userScopes, entitySubType) {
  return getEnvironmentValuesForEntitySubType(entitySubType)
    .filter(({ scope }) => {
      if (scope == null) {
        return true
      } else {
        return userScopes?.includes(scope)
      }
    })
    .map(({ kebabName }) => kebabName)
    .sort(sortByEnv)
}

function getEnvironmentsThatNeed(userScopes) {
  return Object.values(environments)
    .filter(({ scope }) => userScopes.includes(scope))
    .map(({ kebabName }) => kebabName)
}

function getAllEnvironmentKebabNames() {
  return Object.values(environments).map(({ kebabName }) => kebabName)
}

export { getEnvironments, getEnvironmentsThatNeed, getAllEnvironmentKebabNames }
