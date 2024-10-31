import { provideDeployment } from '~/src/server/deployments/helpers/pre/provide-deployment.js'
import { fetchDeployment } from '~/src/server/deployments/helpers/fetch/fetch-deployment.js'
import { deploymentInProgressFixture } from '~/src/__fixtures__/deployment-in-progress.js'
import { deploymentSuccessFixture } from '~/src/__fixtures__/deployment-success.js'
import { repositoryFixture } from '~/src/__fixtures__/repository.js'
import { fetchRepository } from '~/src/server/services/helpers/fetch/fetch-repository.js'

jest.mock('~/src/server/deployments/helpers/fetch/fetch-deployment')
jest.mock('~/src/server/services/helpers/fetch/fetch-repository')

describe('#provideDeployment', () => {
  const mockIsXhr = jest.fn()
  const mockRequest = {
    params: { deploymentId: '3f5dff54-9bea-4a53-830d-96610af8c2b4' },
    isXhr: mockIsXhr
  }

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('With an in-progress deployment', () => {
    beforeEach(() => {
      fetchDeployment.mockResolvedValue(deploymentInProgressFixture)
      fetchRepository.mockResolvedValue(repositoryFixture)
      mockIsXhr.mockReturnValue(false)
    })

    test('Should provide expected deployment', async () => {
      expect(await provideDeployment.method(mockRequest)).toEqual({
        ...deploymentInProgressFixture,
        ...repositoryFixture.repository,
        statusClasses: 'govuk-tag--purple',
        isBackend: false,
        isFrontend: true
      })
    })
  })

  describe('With a successful deployment', () => {
    beforeEach(() => {
      fetchDeployment.mockResolvedValue(deploymentSuccessFixture)
      fetchRepository.mockResolvedValue(repositoryFixture)
      mockIsXhr.mockReturnValue(false)
    })

    test('Should provide expected deployment', async () => {
      expect(await provideDeployment.method(mockRequest)).toEqual({
        ...deploymentSuccessFixture,
        ...repositoryFixture.repository,
        statusClasses: 'govuk-tag--green',
        isBackend: false,
        isFrontend: true
      })
    })
  })
})
