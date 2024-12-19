import { environmentsDetail } from '~/src/config/environments.js'

function getEnvironments(scopes = []) {
  return Object.values(environmentsDetail)
    .filter(({ scope }) => {
      if (!scope) {
        return true
      } else {
        return scopes.includes(scope)
      }
    })
    .map(({ kebabName }) => kebabName)
}

function getEnvironmentsThatNeed(scopes = []) {
  return Object.values(environmentsDetail)
    .filter(({ scope }) => scopes.includes(scope))
    .map(({ kebabName }) => kebabName)
}

function getAllEnvironmentKebabNames() {
  return Object.values(environmentsDetail).map(({ kebabName }) => kebabName)
}

export { getEnvironments, getEnvironmentsThatNeed, getAllEnvironmentKebabNames }
