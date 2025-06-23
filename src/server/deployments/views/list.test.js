import {
  initialiseServer,
  mockAuthAndRenderUrl
} from '~/test-helpers/common-page-rendering.js'
import { statusCodes } from '~/src/server/common/constants/status-codes.js'
import { pagination } from '~/src/server/common/constants/pagination.js'
import { cdpTeamFixture } from '~/src/__fixtures__/admin/cdp-team.js'
import { fetchDeploymentsWithMigrations } from '~/src/server/deployments/helpers/fetch/fetch-deployments-with-migrations.js'
import { deploymentsWithMigrationsFixture } from '~/src/__fixtures__/deployments/deployments-with-migrations.js'
import { fetchDeploymentFilters } from '~/src/server/deployments/helpers/fetch/fetch-deployment-filters.js'
import { deploymentsFiltersFixture } from '~/src/__fixtures__/deployments/deployments-filters.js'
import { fetchServices } from '~/src/server/common/helpers/fetch/fetch-entities.js'
import { entityServicesFixture } from '~/src/__fixtures__/services/entities.js'

jest.mock('~/src/server/common/helpers/auth/get-user-session.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-entities.js')
jest.mock('~/src/server/deployments/helpers/fetch/fetch-deployment-filters.js')
jest.mock(
  '~/src/server/deployments/helpers/fetch/fetch-deployments-with-migrations.js'
)

describe('Deployments list page', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  beforeAll(async () => {
    jest.useFakeTimers({ advanceTimers: true })
    jest.setSystemTime(new Date('2025-05-10T14:16:00.000Z'))

    fetchServices.mockResolvedValue(entityServicesFixture)
    fetchDeploymentFilters.mockResolvedValue(deploymentsFiltersFixture)
    fetchDeploymentsWithMigrations.mockResolvedValue(
      deploymentsWithMigrationsFixture
    )

    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
    jest.useRealTimers()
  })

  test('redirect when going to section root', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/deployments'
    })
    expect(statusCode).toBe(statusCodes.redirect)
  })

  test('renders for logged out users', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: `/deployments/dev?page=${pagination.page}&size=${pagination.size}`,
      isAdmin: false,
      isTenant: false
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })

  test('renders for logged in admin user', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: `/deployments/dev?page=${pagination.page}&size=${pagination.size}`,
      isAdmin: true,
      isTenant: false,
      additionalScopes: [cdpTeamFixture.team.teamId]
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })
})
