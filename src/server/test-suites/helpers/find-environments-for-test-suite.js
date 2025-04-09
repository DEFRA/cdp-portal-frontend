import { testEnvironments } from '~/src/config/test-environments.js'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import { testKind } from '~/src/server/test-suites/constants/test-kind.js'

const logger = createLogger()

function findEnvironmentsForTestSuite(repo) {
  const topics = repo?.topics

  if (topics?.some((t) => t === testKind.performance)) {
    return testEnvironments.performance
  }

  if (topics?.some((t) => t === testKind.journey)) {
    return testEnvironments.journey
  }

  logger.error(
    `Unable to detect test suite type for ${repo?.serviceName} from its topics ${topics}`
  )

  return []
}

export { findEnvironmentsForTestSuite }
