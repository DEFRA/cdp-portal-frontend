import { environmentsDetail } from '~/src/config/environments.js'

const order = [
  environmentsDetail.infraDev.kebabName,
  environmentsDetail.management.kebabName,
  environmentsDetail.dev.kebabName,
  environmentsDetail.test.kebabName,
  environmentsDetail.extTest.kebabName,
  environmentsDetail.perfTest.kebabName,
  environmentsDetail.prod.kebabName
]

const sortByEnv = (a, b) => order.indexOf(a) - order.indexOf(b)
const sortKeyByEnv = (key) => (a, b) => sortByEnv(a[key], b[key])

export { sortByEnv, sortKeyByEnv }
