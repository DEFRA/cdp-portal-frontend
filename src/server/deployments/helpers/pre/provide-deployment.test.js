import { provideDeployment } from './provide-deployment.js'
import { fetchDeployment } from '../fetch/fetch-deployment.js'
import { deploymentInProgressFixture } from '../../../../__fixtures__/deployments/deployment-in-progress.js'
import { deploymentSuccessFixture } from '../../../../__fixtures__/deployments/deployment-success.js'
import { fetchEntity } from '../../../common/helpers/fetch/fetch-entities.js'

vi.mock('../fetch/fetch-deployment')
vi.mock('../../../common/helpers/fetch/fetch-entities.js')

const entityFixture = {
  teams: [
    {
      teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
      name: 'Platform'
    },
    {
      teamId: null,
      name: 'NoTeamId'
    }
  ]
}

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
      fetchEntity.mockResolvedValue(entityFixture)
      mockIsXhr.mockReturnValue(false)
    })

    test('Should provide expected deployment', async () => {
      expect(await provideDeployment.method(mockRequest)).toEqual({
        ...deploymentInProgressFixture,
        teams: [entityFixture.teams[0]],
        statusClass: 'app-tag--purple'
      })
    })
  })

  describe('With a successful deployment', () => {
    beforeEach(() => {
      fetchDeployment.mockResolvedValue(deploymentSuccessFixture)
      fetchEntity.mockResolvedValue(entityFixture)
      mockIsXhr.mockReturnValue(false)
    })

    test('Should provide expected deployment', async () => {
      expect(await provideDeployment.method(mockRequest)).toEqual({
        ...deploymentSuccessFixture,
        teams: [entityFixture.teams[0]],
        statusClass: 'govuk-tag--green'
      })
    })
  })

  describe('With a missing entity', () => {
    beforeEach(() => {
      fetchDeployment.mockResolvedValue(deploymentSuccessFixture)
      fetchEntity.mockResolvedValue(null)
      mockIsXhr.mockReturnValue(false)
    })

    test('Should provide deployment with empty teams', async () => {
      expect(await provideDeployment.method(mockRequest)).toEqual({
        ...deploymentSuccessFixture,
        teams: [],
        statusClass: 'govuk-tag--green'
      })
    })
  })
})
