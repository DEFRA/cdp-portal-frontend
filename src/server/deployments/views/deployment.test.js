import {
  initialiseServer,
  mockAuthAndRenderUrl
} from '#test-helpers/common-page-rendering.js'
import { deploymentFixture } from '../../../__fixtures__/deployments/deployment.js'
import { statusCodes } from '@defra/cdp-validation-kit'
import { fetchDeployment } from '../helpers/fetch/fetch-deployment.js'
import { fetchEntity } from '../../common/helpers/fetch/fetch-entities.js'

vi.mock('../../common/helpers/auth/get-user-session.js')
vi.mock('../helpers/fetch/fetch-deployment.js')
vi.mock('../../common/helpers/fetch/fetch-entities.js')

const entityFixture = {
  teams: [
    {
      teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
      name: 'Platform'
    }
  ]
}

describe('Microservice deployment page', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server
  const deploymentPageUrl = `/deployments/${deploymentFixture.environment}/${deploymentFixture.cdpDeploymentId}`

  beforeAll(async () => {
    fetchDeployment.mockResolvedValue(deploymentFixture)
    fetchEntity.mockResolvedValue(entityFixture)
    server = await initialiseServer()

    vi.useFakeTimers({ advanceTimers: true })
    vi.setSystemTime(new Date('2025-05-10T14:16:00.000Z'))
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
    vi.useRealTimers()
  })

  test('renders for logged out users', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: deploymentPageUrl,
      isAdmin: false,
      isTenant: false
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })

  test('renders for logged in admin user', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: deploymentPageUrl,
      isAdmin: true,
      isTenant: false
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })
})
