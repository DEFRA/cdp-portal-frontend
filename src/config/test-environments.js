import { environments } from './environments.js'

const testEnvironments = {
  performance: [environments.perfTest.kebabName],
  journey: [
    environments.test.kebabName,
    environments.dev.kebabName,
    environments.perfTest.kebabName,
    environments.prod.kebabName
  ]
}

export { testEnvironments }
