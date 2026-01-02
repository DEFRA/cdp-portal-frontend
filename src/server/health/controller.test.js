import { statusCodes } from '@defra/cdp-validation-kit'

import { createTestServer } from '../../../test-helpers/create-test-server.js'
import { healthController } from './controller.js'

describe('#healthController', () => {
  let server

  beforeAll(async () => {
    server = await createTestServer({
      routes: { method: 'GET', path: '/health', ...healthController }
    })
  })

  test('Should provide expected healthy response', async () => {
    const { result, statusCode } = await server.inject({
      method: 'GET',
      url: '/health'
    })

    expect(result).toEqual({ message: 'success' })
    expect(statusCode).toBe(statusCodes.ok)
  })
})
