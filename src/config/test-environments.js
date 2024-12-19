import { environmentsDetail } from '~/src/config/environments.js'

const testEnvironments = {
  performance: [environmentsDetail.perfTest.kebabName],
  journey: [
    environmentsDetail.test.kebabName,
    environmentsDetail.dev.kebabName,
    environmentsDetail.perfTest.kebabName,
    environmentsDetail.prod.kebabName
  ]
}

export { testEnvironments }
