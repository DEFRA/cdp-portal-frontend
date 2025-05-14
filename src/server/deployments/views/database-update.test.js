import {
  initialiseServer,
  mockAuthAndRenderUrl
} from '~/test-helpers/common-page-rendering.js'
import { statusCodes } from '~/src/server/common/constants/status-codes.js'
import { fetchMigrationRun } from '~/src/server/deployments/helpers/fetchers.js'
import { migrationRunFixture } from '~/src/__fixtures__/migrations/migration-run.js'

jest.mock('~/src/server/common/helpers/auth/get-user-session.js')
jest.mock('~/src/server/deployments/helpers/fetch/fetch-deployment.js')
jest.mock('~/src/server/deployments/helpers/fetchers.js')

describe('Database update page', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server
  const databaseUpdatePageUrl = `/deployments/database-updates/${migrationRunFixture.environment}/${migrationRunFixture.cdpMigrationId}`

  beforeAll(async () => {
    jest.useFakeTimers({ advanceTimers: true })
    jest.setSystemTime(new Date('2025-05-14T14:16:00.000Z'))

    fetchMigrationRun.mockResolvedValue(migrationRunFixture)
    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
    jest.useRealTimers()
  })

  test('renders for logged out users', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: databaseUpdatePageUrl
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
