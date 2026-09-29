import { entitySubTypes, scopes, statusCodes } from '@defra/cdp-validation-kit'

import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockServiceEntityCallWithPostgres,
  mockTeam
} from '#test-helpers/common-page-rendering.js'
import { fetchEntity } from '#server/common/helpers/fetch/fetch-entities.js'

vi.mock('../../../common/helpers/fetch/fetch-entities.js')
vi.mock('../../../common/helpers/auth/get-user-session.js')
vi.mock('../../helpers/fetch/fetch-shuttering-urls.js')

const serviceName = 'mock-service-with-terminal'
const terminalUrl = `/services/${serviceName}/terminal`

describe('Service Terminal page', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  beforeAll(async () => {
    mockServiceEntityCallWithPostgres(serviceName, entitySubTypes.backend)
    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('redirects to the first environment the user can launch in', async () => {
    const { headers, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: terminalUrl,
      isAdmin: false,
      isTenant: true,
      teamScope: mockTeam.teamId
    })
    expect(statusCode).toBe(statusCodes.redirect)
    expect(headers.location).toBe(`${terminalUrl}/dev`)
  })

  test('page renders for logged in admin user', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: `${terminalUrl}/dev`,
      isAdmin: true,
      isTenant: true
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })

  test('page renders for logged in service owner tenant', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: `${terminalUrl}/dev`,
      isAdmin: false,
      isTenant: true,
      teamScope: mockTeam.teamId
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })

  test('page renders prod for admin user with break glass', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: `${terminalUrl}/prod`,
      isAdmin: true,
      isTenant: true,
      teamScope: mockTeam.teamId,
      additionalScopes: [`${scopes.breakGlass}:team:${mockTeam.teamId}`]
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })

  test('prod renders for service owner tenant with break glass', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: `${terminalUrl}/prod`,
      isAdmin: false,
      isTenant: true,
      teamScope: mockTeam.teamId,
      additionalScopes: [`${scopes.breakGlass}:team:${mockTeam.teamId}`]
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toContain('app-button--significant')
  })

  test('prod is not found for service owner tenant without break glass', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: `${terminalUrl}/prod`,
      isAdmin: false,
      isTenant: true,
      teamScope: mockTeam.teamId
    })
    expect(statusCode).toBe(statusCodes.notFound)
  })

  test('unknown environment is not found', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: `${terminalUrl}/not-an-env`,
      isAdmin: true,
      isTenant: true
    })
    expect(statusCode).toBe(statusCodes.notFound)
  })

  test('page errors for logged in non-service owner tenant', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: `${terminalUrl}/dev`,
      isAdmin: false,
      isTenant: true
    })
    expect(statusCode).toBe(statusCodes.forbidden)
  })

  test('page errors with 401 for logged out user', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: terminalUrl,
      isAdmin: false,
      isTenant: false
    })
    expect(statusCode).toBe(statusCodes.unauthorized)
  })

  test('page renders empty state when service is in no environments', async () => {
    const entity = await fetchEntity()
    fetchEntity.mockResolvedValue({ ...entity, environments: {} })

    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: terminalUrl,
      isAdmin: true,
      isTenant: true
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toContain('does not exist in any environment')

    fetchEntity.mockResolvedValue(entity)
  })
})
