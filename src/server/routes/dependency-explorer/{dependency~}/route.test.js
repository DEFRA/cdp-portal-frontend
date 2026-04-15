import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockFetchCdpTeamsCall
} from '#test-helpers/common-page-rendering.js'
import { statusCodes } from '@defra/cdp-validation-kit'
import { getDependencyDependents } from '../DependencyService.js'
import { getEntityTags } from '../FilterService.js'
import { fetchEntities } from '#server/common/helpers/fetch/fetch-entities.js'

vi.mock('#server/common/helpers/auth/get-user-session.js')
vi.mock('#server/teams/helpers/fetch/fetch-cdp-teams.js')
vi.mock('#server/common/helpers/fetch/fetch-entities.js')
vi.mock('../DependencyService.js')
vi.mock('../FilterService.js')

mockFetchCdpTeamsCall()
getDependencyDependents.mockResolvedValue({
  results: [],
  meta: { total: 0, totalPages: 1 }
})
getEntityTags.mockResolvedValue([])
fetchEntities.mockResolvedValue([])

describe('Dependency explorer page', () => {
  let server

  beforeAll(async () => {
    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('page renders for logged in admin user', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/dependency-explorer',
      isAdmin: true,
      isTenant: true
    })

    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })

  test('page renders for logged in tenant', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/dependency-explorer',
      isAdmin: false,
      isTenant: true
    })

    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })

  test('page renders for logged in service owner tenant', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/dependency-explorer',
      isAdmin: false,
      isTenant: true,
      teamScope: 'mock-team-id'
    })

    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })

  test('page renders for logged out user', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/dependency-explorer',
      isAdmin: false,
      isTenant: false
    })

    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })
})
