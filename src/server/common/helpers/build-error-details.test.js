import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { joiValidationErrorDetailsFixture } from '~/src/__fixtures__/joi-validation-error-details.js'

describe('#buildErrorDetails', () => {
  test('Should provide expected error details', () => {
    expect(buildErrorDetails(joiValidationErrorDetailsFixture)).toEqual({
      autoDeployEnvironments: {
        message: 'Environment is not available for this service'
      },
      environment: {
        message: 'Choose an entry'
      },
      imageName: {
        message: 'Choose an entry'
      },
      version: {
        message: 'Choose an entry'
      }
    })
  })
})
