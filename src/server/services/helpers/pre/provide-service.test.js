import { provideService } from '~/src/server/services/helpers/pre/provide-service'
import { serviceDeployableFixture } from '~/src/__fixtures__/service-deployable'
import { repositoryFixture } from '~/src/__fixtures__/repository'

describe('#provideService', () => {
  const mockFetchDeployableService = jest.fn()
  const mockFetchRepository = jest.fn()
  const mockRequest = {
    params: { serviceId: 'cdp-portal-frontend' },
    server: {
      methods: {
        fetchDeployableService: mockFetchDeployableService,
        fetchRepository: mockFetchRepository
      }
    }
  }

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('With a deployable service', () => {
    beforeEach(() => {
      mockFetchDeployableService.mockResolvedValue(serviceDeployableFixture)
      mockFetchRepository.mockResolvedValue(repositoryFixture)
    })

    test('Should provide expected deployable service type property', async () => {
      expect(await provideService.method(mockRequest)).toEqual(
        expect.objectContaining({ isDeployable: true })
      )
    })

    test('Should provide expected github decorated deployable service', async () => {
      expect(await provideService.method(mockRequest)).toEqual({
        createdAt: '2023-04-12T17:16:48+00:00',
        description: 'The Core Delivery Platform Portal.',
        githubUrl: 'https://github.com/DEFRA',
        id: 'cdp-portal-frontend',
        imageName: 'cdp-portal-frontend',
        isArchived: false,
        isBackend: false,
        isDeployable: true,
        isFrontend: true,
        isPrivate: true,
        isTemplate: false,
        primaryLanguage: 'JavaScript',
        serviceName: 'cdp-portal-frontend',
        teams: [
          {
            github: 'cdp-platform',
            name: 'Platform',
            teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
          }
        ],
        topics: ['frontend', 'node', 'cdp', 'service']
      })
    })
  })
})
