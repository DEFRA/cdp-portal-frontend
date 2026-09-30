import { orderedEnvironments } from '@defra/cdp-validation-kit/src/constants/environments.js'

export const sortByEnv = (a, b) =>
  orderedEnvironments.indexOf(a) - orderedEnvironments.indexOf(b)

export const sortKeyByEnv = (key) => (a, b) => sortByEnv(a[key], b[key])
