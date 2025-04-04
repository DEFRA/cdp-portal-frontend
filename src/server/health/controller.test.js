import { config } from '~/src/config/config.js'
import { createServer } from '~/src/server/index.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

jest.mock('~/src/server/common/helpers/fetch/fetch-json.js')

describe('#healthController', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  beforeAll(async () => {
    jest.mocked(fetchJson).mockImplementationOnce((url) => {
      // Setting up oidc fetcher call
      if (url === config.get('oidcWellKnownConfigurationUrl')) {
        return Promise.resolve({
          res: {
            statusCode: 200
          },
          payload: {
            token_endpoint: 'https://mock-login/oauth2/v2.0/token',
            authorization_endpoint: 'https://mock-login/oauth2/v2.0/authorize'
          }
        })
      }

      return Promise.resolve({})
    })

    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('Should provide expected healthy response', async () => {
    const { result, statusCode } = await server.inject({
      method: 'GET',
      url: '/health'
    })

    expect(result).toEqual({ message: 'success' })
    expect(statusCode).toBe(200)
  })
})
