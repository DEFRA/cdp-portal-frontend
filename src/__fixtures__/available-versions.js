// Response from portalBackendApi/deployables
import { buildOptions } from '~/src/server/common/helpers/options/build-options'

const availableVersionsFixture = ['0.87.0', '0.86.0', '0.85.0', '0.84.0']

// Response from portalFrontend/deploy-service/available-versions
const availableVersionsOptionsFixture = buildOptions(
  availableVersionsFixture,
  false
)

export { availableVersionsFixture, availableVersionsOptionsFixture }
