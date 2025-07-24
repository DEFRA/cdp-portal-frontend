import { testEnvironments } from '../../../config/test-environments.js'
import { createLogger } from '../../common/helpers/logging/logger.js'
import { testKind } from '../constants/test-kind.js'

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
