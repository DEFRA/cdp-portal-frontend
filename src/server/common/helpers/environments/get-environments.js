import {
  environments,
  prototypeEnvironments
} from '~/src/config/environments.js'

function getEnvironments(scopes, entityType = undefined) {
  return getEnvironmentValuesForEntityType(entityType)
    .filter(({ scope }) => {
      if (!scope) {
        return true
      } else {
        return scopes?.includes(scope)
      }
    })
    .map(({ kebabName }) => kebabName)
}

function getEnvironmentsThatNeed(scopes, entityType = undefined) {
  return getEnvironmentValuesForEntityType(entityType)
    .filter(({ scope }) => scopes.includes(scope))
    .map(({ kebabName }) => kebabName)
}

function getAllEnvironmentKebabNames(entityType = undefined) {
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
