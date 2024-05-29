import { environments } from '~/src/config'

const testEnvironments = {
  performance: [environments.perfTest],
  smoke: [
    environments.test,
    environments.dev,
    environments.perfTest,
    environments.prod
  ],
  environment: [environments.test, environments.dev]
}

export { testEnvironments }
