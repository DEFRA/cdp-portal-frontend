import {
  initialiseServer,
  mockAuthAndRenderUrl
} from '~/test-helpers/common-page-rendering.js'
import { deploymentFixture } from '~/src/__fixtures__/deployments/deployment.js'
import { statusCodes } from '~/src/server/common/constants/status-codes.js'
import { fetchDeployment } from '~/src/server/deployments/helpers/fetch/fetch-deployment.js'
import { fetchRepository } from '~/src/server/common/helpers/fetch/fetch-repository.js'
import { repositoryFixture } from '~/src/__fixtures__/repository.js'

jest.mock('~/src/server/common/helpers/auth/get-user-session.js')
jest.mock('~/src/server/deployments/helpers/fetch/fetch-deployment.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-repository.js')

describe('Microservice deployment page', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server
  const deploymentPageUrl = `/deployments/${deploymentFixture.environment}/${deploymentFixture.cdpDeploymentId}`

  beforeAll(async () => {
    jest.useFakeTimers({ advanceTimers: true })
    jest.setSystemTime(new Date('2025-05-10T14:16:00.000Z'))

    fetchDeployment.mockResolvedValue(deploymentFixture)
    fetchRepository.mockResolvedValue(repositoryFixture)
    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
    jest.useRealTimers()
  })

  test('renders for logged out users', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: deploymentPageUrl
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
