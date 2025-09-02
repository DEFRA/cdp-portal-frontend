import {
  initialiseServer,
  mockAuthAndRenderUrl
} from '../../../../test-helpers/common-page-rendering.js'
import { deploymentFixture } from '../../../__fixtures__/deployments/deployment.js'
import { statusCodes } from '@defra/cdp-validation-kit/src/constants/status-codes.js'
import { fetchDeployment } from '../helpers/fetch/fetch-deployment.js'
import { fetchRepository } from '../../common/helpers/fetch/fetch-repository.js'
import { repositoryFixture } from '../../../__fixtures__/repository.js'

vi.mock('../../common/helpers/auth/get-user-session.js')
vi.mock('../helpers/fetch/fetch-deployment.js')
vi.mock('../../common/helpers/fetch/fetch-repository.js')

describe('Microservice deployment page', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server
  const deploymentPageUrl = `/deployments/${deploymentFixture.environment}/${deploymentFixture.cdpDeploymentId}`

  beforeAll(async () => {
    vi.useFakeTimers({ advanceTimers: true })
    vi.setSystemTime(new Date('2025-05-10T14:16:00.000Z'))

    fetchDeployment.mockResolvedValue(deploymentFixture)
    fetchRepository.mockResolvedValue(repositoryFixture)
    server = await initialiseServer()
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
