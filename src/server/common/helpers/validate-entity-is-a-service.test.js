import { validateEntityIsAService } from '~/src/server/common/helpers/validate-entity-is-a-service.js'
import Boom from '@hapi/boom'

describe('#validateEntityIsAService', () => {
  const mockResponseToolkit = {
    continue: 'mockContinue'
  }
  let mockRequest

  test('When entity is NOT a test suite should return continue', async () => {
    mockRequest = {
      app: {
        entity: {
          type: 'Microservice'
        }
      }
    }

    const result = await validateEntityIsAService(
      mockRequest,
      mockResponseToolkit
    )

    expect(result).toEqual(mockResponseToolkit.continue)
  })

  test('When entity is a test-suite, should return notFound', async () => {
    mockRequest = {
      app: {
        entity: {
          type: 'TestSuite'
        }
      }
    }

    const result = await validateEntityIsAService(
      mockRequest,
      mockResponseToolkit
    )

    expect(result).toEqual(Boom.notFound())
  })

  test('When entity is undefined, should return notFound', async () => {
    mockRequest = {
      app: {}
    }

    const result = await validateEntityIsAService(
      mockRequest,
      mockResponseToolkit
    )

    expect(result).toEqual(Boom.notFound())
  })
})
