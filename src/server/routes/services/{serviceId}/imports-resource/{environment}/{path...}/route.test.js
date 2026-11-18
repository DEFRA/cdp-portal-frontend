import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockServiceEntityCallWithPostgres
} from '#test-helpers/common-page-rendering.js'
import { entitySubTypes, scopes, statusCodes } from '@defra/cdp-validation-kit'
import { betaTesterScope } from '#server/common/constants/scopes.js'
import { getFileUrl } from '#server/common/services/bucket-service/BucketService.js'
import Boom from '@hapi/boom'

vi.mock('#server/common/helpers/fetch/fetch-entities.js')
vi.mock('#server/common/helpers/auth/get-user-session.js')
vi.mock('#server/services/helpers/fetch/fetch-shuttering-urls.js')
vi.mock('#server/services/helpers/fetch/fetch-resources.js')
vi.mock('#server/common/services/bucket-service/BucketService.js')

const serviceName = 'mock-service-with-resources'
const fileUrl = (environment) =>
  `/services/${serviceName}/imports-resource/${environment}/data.dump`
const betaOwner = {
  isAdmin: false,
  isTenant: true,
  teamScope: 'mock-team-id',
  additionalScopes: [betaTesterScope]
}

describe('Service imports resource', () => {
  let server

  beforeAll(async () => {
    mockServiceEntityCallWithPostgres(serviceName, entitySubTypes.backend)
    // Stops the download before it proxies: a 404 means the request got past auth and break-glass
    getFileUrl.mockRejectedValue(Boom.notFound())
    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('reaches the handler for admin', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: fileUrl('test'),
      isAdmin: true,
      isTenant: true
    })
    expect(statusCode).toBe(statusCodes.notFound)
  })

  test('reaches the handler for beta service owner', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      ...betaOwner,
      targetUrl: fileUrl('test')
    })
    expect(statusCode).toBe(statusCodes.notFound)
  })

  test('is forbidden for service owner without beta scope', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      ...betaOwner,
      additionalScopes: [],
      targetUrl: fileUrl('test')
    })
    expect(statusCode).toBe(statusCodes.forbidden)
  })

  test('is forbidden for beta tester who does not own service', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      ...betaOwner,
      teamScope: undefined,
      targetUrl: fileUrl('test')
    })
    expect(statusCode).toBe(statusCodes.forbidden)
  })

  test('requires break-glass for download in prod', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      ...betaOwner,
      targetUrl: fileUrl('prod')
    })
    expect(statusCode).toBe(statusCodes.unauthorized)
  })

  test('reaches the download in prod with team break-glass', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      ...betaOwner,
      additionalScopes: [
        betaTesterScope,
        `${scopes.breakGlass}:team:mock-team-id`
      ],
      targetUrl: fileUrl('prod')
    })
    expect(statusCode).toBe(statusCodes.notFound)
  })
})
