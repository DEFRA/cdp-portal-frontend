import { environments } from '~/src/config/environments.js'

function getEnvironments(scopes = []) {
  return Object.values(environments)
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
  return Object.values(environments)
    .filter(({ scope }) => scopes.includes(scope))
    .map(({ kebabName }) => kebabName)
}

function getAllEnvironmentKebabNames() {
  return Object.values(environments).map(({ kebabName }) => kebabName)
}

function getAllEnvironmentKebabNamesExceptProd() {
  return getAllEnvironmentKebabNames().filter(
    (env) => env !== environments.prod.kebabName
  )
}

export {
  getEnvironments,
  getEnvironmentsThatNeed,
  getAllEnvironmentKebabNames,
  getAllEnvironmentKebabNamesExceptProd
}
