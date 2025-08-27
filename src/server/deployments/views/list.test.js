import {
  initialiseServer,
  mockAuthAndRenderUrl
} from '../../../../test-helpers/common-page-rendering.js'
import { statusCodes } from '@defra/cdp-validation-kit/src/constants/status-codes.js'
import { pagination } from '../../common/constants/pagination.js'
import { cdpTeamFixture } from '../../../__fixtures__/admin/cdp-team.js'
import { fetchDeploymentsWithMigrations } from '../helpers/fetch/fetch-deployments-with-migrations.js'
import { deploymentsWithMigrationsFixture } from '../../../__fixtures__/deployments/deployments-with-migrations.js'
import { fetchDeploymentFilters } from '../helpers/fetch/fetch-deployment-filters.js'
import { deploymentsFiltersFixture } from '../../../__fixtures__/deployments/deployments-filters.js'
import { fetchServices } from '../../common/helpers/fetch/fetch-entities.js'
import { entityServicesFixture } from '../../../__fixtures__/services/entities.js'

vi.mock('../../common/helpers/auth/get-user-session.js')
vi.mock('../../common/helpers/fetch/fetch-entities.js')
vi.mock('../helpers/fetch/fetch-deployment-filters.js')
vi.mock('../helpers/fetch/fetch-deployments-with-migrations.js')

describe('Deployments list page', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  beforeAll(async () => {
    vi.useFakeTimers({ advanceTimers: true })
    vi.setSystemTime(new Date('2025-05-10T14:16:00.000Z'))

    fetchServices.mockResolvedValue(entityServicesFixture)
    fetchDeploymentFilters.mockResolvedValue(deploymentsFiltersFixture)
    fetchDeploymentsWithMigrations.mockResolvedValue(
      deploymentsWithMigrationsFixture
    )

    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
    vi.useRealTimers()
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
      additionalScopes: [`team:${cdpTeamFixture.team.teamId}`]
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })
})
