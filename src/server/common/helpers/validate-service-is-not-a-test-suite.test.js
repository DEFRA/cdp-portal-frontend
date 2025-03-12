import { validateServiceIsNotATestSuite } from '~/src/server/common/helpers/validate-service-is-not-a-test-suite.js'
import Boom from '@hapi/boom'

describe('#validateServiceIsNotATestSuite', () => {
  const mockResponseToolkit = {
    continue: 'mockContinue'
  }
  let mockRequest

  test('When service is NOT a test suite should return continue', async () => {
    mockRequest = {
      app: {
        service: {
          isTestSuite: false
        }
      }
    }

    const result = await validateServiceIsNotATestSuite(
      mockRequest,
      mockResponseToolkit
    )

    expect(result).toEqual(mockResponseToolkit.continue)
  })

  test('When service is a test-suite, should return notFound', async () => {
    mockRequest = {
      app: {
        service: {
          isTestSuite: true
        }
      }
    }

    const result = await validateServiceIsNotATestSuite(
      mockRequest,
      mockResponseToolkit
    )

    expect(result).toEqual(Boom.notFound())
  })

  test('When service is undefined, should return notFound', async () => {
    mockRequest = {
      app: {}
    }

    const result = await validateServiceIsNotATestSuite(
      mockRequest,
      mockResponseToolkit
    )

    expect(result).toEqual(Boom.notFound())
  })
})
