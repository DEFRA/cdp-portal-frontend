import { entitySubTypes, scopes, statusCodes } from '@defra/cdp-validation-kit'

import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockServiceEntityCall,
  mockTeam
} from '../../../../../test-helpers/common-page-rendering.js'

vi.mock('../../../common/helpers/fetch/fetch-entities.js')
vi.mock('../../../common/helpers/auth/get-user-session.js')
vi.mock('../../helpers/fetch/fetch-shuttering-urls.js')

describe('Service Terminal page', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  beforeAll(async () => {
    const serviceName = 'mock-service-with-terminal'
    mockServiceEntityCall(serviceName, entitySubTypes.backend)
    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('page renders for logged in admin user', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/services/mock-service-with-terminal/terminal',
      isAdmin: true,
      isTenant: true
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })

  test('page renders for with prod terminal button for admin user with break glass', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/services/mock-service-with-terminal/terminal',
      isAdmin: true,
      isTenant: true,
      teamScope: mockTeam.teamId,
      additionalScopes: [`${scopes.breakGlass}:team:${mockTeam.teamId}`]
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })

  test('page errors for logged in non-service owner tenant', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/services/mock-service-with-terminal/terminal',
      isAdmin: false,
      isTenant: true
    })
    expect(statusCode).toBe(statusCodes.forbidden)
  })

  test('page renders for logged in service owner tenant', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/services/mock-service-with-terminal/terminal',
      isAdmin: false,
      isTenant: true,
      teamScope: 'mock-team-id'
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })

  test('page renders for with prod terminal button for service owner tenant', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/services/mock-service-with-terminal/terminal',
      isAdmin: false,
      isTenant: true,
      teamScope: mockTeam.teamId,
      additionalScopes: [`${scopes.breakGlass}:team:${mockTeam.teamId}`]
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })

  test('page errors with 401 for logged out user', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/services/mock-service-with-terminal/terminal',
      isAdmin: false,
      isTenant: false
    })
    expect(statusCode).toBe(statusCodes.unauthorized)
  })
})
