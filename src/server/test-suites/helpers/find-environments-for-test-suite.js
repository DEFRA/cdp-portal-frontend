import { testEnvironments } from '~/src/config/test-environments.js'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import { testKind } from '~/src/server/test-suites/constants/test-kind.js'

const logger = createLogger()

function findEnvironmentsForTestSuite(entity) {
  if (entity?.subType === testKind.Performance) {
    return testEnvironments.performance
  }

  if (entity?.subType === testKind.Journey) {
    return testEnvironments.journey
  }

  logger.error(
    `Unable to detect test suite type for ${entity?.name} from its subType ${entity?.subType}. Defaulting to empty array.`
  )

  return []
}

export { findEnvironmentsForTestSuite }
