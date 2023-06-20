import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { joiValidationErrorDetailsFixture } from '~/src/__fixtures__/joi-validation-error-details'

describe('#buildErrorDetails', () => {
  test('Should provide expected error details', () => {
    expect(buildErrorDetails(joiValidationErrorDetailsFixture)).toEqual({
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
