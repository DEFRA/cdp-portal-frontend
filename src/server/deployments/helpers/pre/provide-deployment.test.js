import { provideDeployment } from './provide-deployment.js'
import { fetchDeployment } from '../fetch/fetch-deployment.js'
import { deploymentInProgressFixture } from '../../../../__fixtures__/deployments/deployment-in-progress.js'
import { deploymentSuccessFixture } from '../../../../__fixtures__/deployments/deployment-success.js'
import { repositoryFixture } from '../../../../__fixtures__/repository.js'
import { fetchRepository } from '../../../common/helpers/fetch/fetch-repository.js'

vi.mock('../fetch/fetch-deployment')
vi.mock('../../../common/helpers/fetch/fetch-repository.js')

describe('#provideDeployment', () => {
  const mockIsXhr = vi.fn()
  const mockRequest = {
    params: { deploymentId: '3f5dff54-9bea-4a53-830d-96610af8c2b4' },
    isXhr: mockIsXhr
  }

  afterEach(() => {
    vi.resetAllMocks()
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
        ...repositoryFixture,
        statusClass: 'app-tag--purple',
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
        ...repositoryFixture,
        statusClass: 'govuk-tag--green',
        isBackend: false,
        isFrontend: true
      })
    })
  })
})
