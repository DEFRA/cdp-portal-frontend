import { environments } from '~/src/config/environments.js'

const order = [
  environments.infraDev.kebabName,
  environments.management.kebabName,
  environments.dev.kebabName,
  environments.test.kebabName,
  environments.extTest.kebabName,
  environments.perfTest.kebabName,
  environments.prod.kebabName
]

const sortByEnv = (a, b) => order.indexOf(a) - order.indexOf(b)

export { sortByEnv }
