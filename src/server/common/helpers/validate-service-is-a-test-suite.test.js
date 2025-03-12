import { validateServiceIsATestSuite } from '~/src/server/common/helpers/validate-service-is-a-test-suite.js'
import Boom from '@hapi/boom'

describe('#validateServiceIsATestSuite', () => {
  const mockResponseToolkit = {
    continue: 'mockContinue'
  }
  let mockRequest

  test('When service is a test suite should return continue', async () => {
    mockRequest = {
      app: {
        service: {
          isTestSuite: true
        }
      }
    }

    const result = await validateServiceIsATestSuite(
      mockRequest,
      mockResponseToolkit
    )

    expect(result).toEqual(mockResponseToolkit.continue)
  })

  test('When service is NOT a test-suite, should return notFound', async () => {
    mockRequest = {
      app: {
        service: {
          isTestSuite: false
        }
      }
    }

    const result = await validateServiceIsATestSuite(
      mockRequest,
      mockResponseToolkit
    )

    expect(result).toEqual(Boom.notFound())
  })

  test('When service is undefined, should return notFound', async () => {
    mockRequest = {
      app: {}
    }

    const result = await validateServiceIsATestSuite(
      mockRequest,
      mockResponseToolkit
    )

    expect(result).toEqual(Boom.notFound())
  })
})
