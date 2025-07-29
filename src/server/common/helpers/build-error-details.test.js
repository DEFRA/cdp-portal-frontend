import { buildErrorDetails } from './build-error-details.js'
import { joiValidationErrorDetailsFixture } from '../../../__fixtures__/joi-validation-error-details.js'

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
