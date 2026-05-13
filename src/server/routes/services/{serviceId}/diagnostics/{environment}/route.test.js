import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockServiceEntityCall,
  mockServicesAdditionalCalls
} from '#test-helpers/common-page-rendering.js'
import { statusCodes } from '@defra/cdp-validation-kit'
import { fetchMarkdown } from '#server/documentation/helpers/s3-file-handler.js'

vi.mock('#server/common/helpers/fetch/fetch-entities.js')
vi.mock('#server/common/helpers/auth/get-user-session.js')
vi.mock('#server/services/helpers/fetch/fetch-shuttering-urls.js')
vi.mock('#server/common/helpers/fetch/fetch-running-services.js')
vi.mock('#server/documentation/helpers/s3-file-handler.js')

const serviceName = 'mock-service-with-resources'

describe('Diagnostics page', () => {
  let server

  beforeAll(async () => {
    mockServiceEntityCall(serviceName)
    mockServicesAdditionalCalls({
      repositoryName: serviceName,
      frontendOrBackend: 'frontend'
    })
    fetchMarkdown.mockResolvedValue('')

    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('page renders for logged in admin user', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: `/services/${serviceName}/diagnostics/prod`,
      isAdmin: true,
      isTenant: true
    })

    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })

  test('page DOES NOT render for logged in tenant', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: `/services/${serviceName}/diagnostics/prod`,
      isAdmin: false,
      isTenant: true
    })

    expect(statusCode).toBe(statusCodes.forbidden)
    expect(result).toMatchFile()
  })

  test('page DOES NOT render for logged in service owner tenant', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: `/services/${serviceName}/diagnostics/prod`,
      isAdmin: false,
      isTenant: true,
      teamScope: 'mock-team-id'
    })

    expect(statusCode).toBe(statusCodes.forbidden)
    expect(result).toMatchFile()
  })

  test('page DOES NOT render for logged out user', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: `/services/${serviceName}/diagnostics/prod`,
      isAdmin: false,
      isTenant: false
    })

    expect(statusCode).toBe(statusCodes.unauthorized)
    expect(result).toMatchFile()
  })
})
