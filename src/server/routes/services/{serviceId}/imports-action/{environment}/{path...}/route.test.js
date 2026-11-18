import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockServiceEntityCallWithPostgres
} from '#test-helpers/common-page-rendering.js'
import { entitySubTypes, scopes, statusCodes } from '@defra/cdp-validation-kit'
import { betaTesterScope } from '#server/common/constants/scopes.js'

vi.mock('#server/common/helpers/fetch/fetch-entities.js')
vi.mock('#server/common/helpers/auth/get-user-session.js')
vi.mock('#server/services/helpers/fetch/fetch-shuttering-urls.js')
vi.mock('#server/services/helpers/fetch/fetch-resources.js')
vi.mock('#server/common/services/bucket-service/BucketService.js')

const serviceName = 'mock-service-with-resources'
const deleteUrl = (environment) =>
  `/services/${serviceName}/imports-action/${environment}/data.dump?action=delete`
const importUrl = (environment) =>
  `/services/${serviceName}/imports-action/${environment}/data.dump?action=import`
const betaOwner = {
  isAdmin: false,
  isTenant: true,
  teamScope: 'mock-team-id',
  additionalScopes: [betaTesterScope]
}

describe('Service imports action page', () => {
  let server

  beforeAll(async () => {
    mockServiceEntityCallWithPostgres(serviceName, entitySubTypes.backend)
    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('renders for admin', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: deleteUrl('test'),
      isAdmin: true,
      isTenant: true
    })
    expect(statusCode).toBe(statusCodes.ok)
  })

  test('renders for beta service owner', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      ...betaOwner,
      targetUrl: deleteUrl('test')
    })
    expect(statusCode).toBe(statusCodes.ok)
  })

  test('is forbidden for service owner without beta scope', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      ...betaOwner,
      additionalScopes: [],
      targetUrl: deleteUrl('test')
    })
    expect(statusCode).toBe(statusCodes.forbidden)
  })

  test('is forbidden for beta tester who does not own service', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      ...betaOwner,
      teamScope: undefined,
      targetUrl: deleteUrl('test')
    })
    expect(statusCode).toBe(statusCodes.forbidden)
  })

  test('allows delete in prod without break-glass', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      ...betaOwner,
      targetUrl: deleteUrl('prod')
    })
    expect(statusCode).toBe(statusCodes.ok)
  })

  test('requires break-glass for import in prod', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      ...betaOwner,
      targetUrl: importUrl('prod')
    })
    expect(statusCode).toBe(statusCodes.unauthorized)
  })

  test('renders import in prod for beta service owner with team break-glass', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      ...betaOwner,
      additionalScopes: [
        betaTesterScope,
        `${scopes.breakGlass}:team:mock-team-id`
      ],
      targetUrl: importUrl('prod')
    })
    expect(statusCode).toBe(statusCodes.ok)
  })
})
