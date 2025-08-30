import {
  environments,
  prototypeEnvironments
} from '../../../../config/environments.js'

function getEnvironments(userScopes, entityType) {
  return getEnvironmentValuesForEntityType(entityType)
    .filter(({ scope }) => {
      if (!scope) {
        return true
      } else {
        return userScopes?.includes(scope)
      }
    })
    .map(({ kebabName }) => kebabName)
}

function getEnvironmentsThatNeed(userScopes, entityType) {
  return getEnvironmentValuesForEntityType(entityType)
    .filter(({ scope }) => userScopes.includes(scope))
    .map(({ kebabName }) => kebabName)
}

function getAllEnvironmentKebabNames(entityType) {
  return getEnvironmentValuesForEntityType(entityType).map(
    ({ kebabName }) => kebabName
  )
}

function getEnvironmentValuesForEntityType(entityType) {
  if (entityType === 'Prototype') {
    return prototypeEnvironments
  } else {
    return Object.values(environments)
  }
}

export { getEnvironments, getEnvironmentsThatNeed, getAllEnvironmentKebabNames }
