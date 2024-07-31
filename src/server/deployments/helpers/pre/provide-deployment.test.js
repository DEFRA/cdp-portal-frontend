import { provideDeployment } from '~/src/server/deployments/helpers/pre/provide-deployment'
import { fetchDeployment } from '~/src/server/deployments/helpers/fetch/fetch-deployment'
import { deploymentInProgressFixture } from '~/src/__fixtures__/deployment-in-progress'
import { deploymentSuccessFixture } from '~/src/__fixtures__/deployment-success'
import { repositoryFixture } from '~/src/__fixtures__/repository'

jest.mock('~/src/server/deployments/helpers/fetch/fetch-deployment')

describe('#provideDeployment', () => {
  const mockIsXhr = jest.fn()
  const mockFetchRepository = jest.fn()
  const mockRequest = {
    params: { deploymentId: '3f5dff54-9bea-4a53-830d-96610af8c2b4' },
    isXhr: mockIsXhr,
    server: {
      methods: {
        fetchRepository: mockFetchRepository
      }
    }
  }

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('With an in-progress deployment', () => {
    beforeEach(() => {
      fetchDeployment.mockResolvedValue(deploymentInProgressFixture)
      mockFetchRepository.mockResolvedValue(repositoryFixture)
      mockIsXhr.mockReturnValue(false)
    })

    test('Should provide expected deployment', async () => {
      expect(await provideDeployment.method(mockRequest)).toEqual({
        ...deploymentInProgressFixture,
        ...repositoryFixture.repository,
        statusClasses: 'govuk-tag--blue',
        isBackend: false,
        isFrontend: true
      })
    })
  })

  describe('With a successful deployment', () => {
    beforeEach(() => {
      fetchDeployment.mockResolvedValue(deploymentSuccessFixture)
      mockFetchRepository.mockResolvedValue(repositoryFixture)
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
