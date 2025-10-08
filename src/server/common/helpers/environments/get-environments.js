import {
  environments,
  prototypeEnvironments
} from '../../../../config/environments.js'
import { entitySubTypes } from '@defra/cdp-validation-kit'

function getEnvironmentValuesForEntitySubType(subType) {
  if (subType === entitySubTypes.prototype) {
    return prototypeEnvironments
  } else {
    return Object.values(environments)
  }
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
