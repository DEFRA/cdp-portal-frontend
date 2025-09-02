import {
  initialiseServer,
  mockAuthAndRenderUrl
} from '../../../../test-helpers/common-page-rendering.js'
import { statusCodes } from '@defra/cdp-validation-kit/src/constants/status-codes.js'
import { fetchMigrationRun } from '../helpers/fetchers.js'
import { migrationRunFixture } from '../../../__fixtures__/migrations/migration-run.js'

vi.mock('../../common/helpers/auth/get-user-session.js')
vi.mock('../helpers/fetch/fetch-deployment.js')
vi.mock('../helpers/fetchers.js')

describe('Database update page', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server
  const databaseUpdatePageUrl = `/deployments/database-updates/${migrationRunFixture.environment}/${migrationRunFixture.cdpMigrationId}`

  beforeAll(async () => {
    vi.useFakeTimers({ advanceTimers: true })
    vi.setSystemTime(new Date('2025-05-14T14:16:00.000Z'))

    fetchMigrationRun.mockResolvedValue(migrationRunFixture)
    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
    vi.useRealTimers()
  })

  test('renders for logged out users', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: databaseUpdatePageUrl,
      isAdmin: false,
      isTenant: false
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })

  test('renders for logged in admin user', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: databaseUpdatePageUrl,
      isAdmin: true,
      isTenant: false
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })
})
