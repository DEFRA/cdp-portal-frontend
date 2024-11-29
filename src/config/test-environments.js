import { environments } from '~/src/config/index.js'

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
