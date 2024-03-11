import { provideDeployment } from '~/src/server/deployments/helpers/pre/provide-deployment'
import { fetchDeployment } from '~/src/server/deployments/helpers/fetch/fetch-deployment'
import { deploymentInProgressFixture } from '~/src/__fixtures__/deployment-in-progress'
import { deploymentSuccessFixture } from '~/src/__fixtures__/deployment-success'

jest.mock('~/src/server/deployments/helpers/fetch/fetch-deployment')

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
      mockIsXhr.mockReturnValue(false)
    })

    test('Should provide expected deployment', async () => {
      expect(await provideDeployment.method(mockRequest)).toEqual(
        deploymentInProgressFixture
      )
    })
  })

  describe('With a successful deployment', () => {
    beforeEach(() => {
      fetchDeployment.mockResolvedValue(deploymentSuccessFixture)
      mockIsXhr.mockReturnValue(false)
    })

    test('Should provide expected deployment', async () => {
      expect(await provideDeployment.method(mockRequest)).toEqual(
        deploymentSuccessFixture
      )
    })
  })
})
