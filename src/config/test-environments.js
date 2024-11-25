import { environments } from '~/src/config/index.js'

const testEnvironments = {
  performance: [environments.perfTest],
  journey: [
    environments.test,
    environments.dev,
    environments.perfTest,
    environments.prod
  ]
}

export { testEnvironments }
