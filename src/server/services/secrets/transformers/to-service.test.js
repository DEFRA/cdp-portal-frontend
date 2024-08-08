import { toService } from '~/src/server/services/secrets/transformers/to-service'
import { repositoryFixture } from '~/src/__fixtures__/repository'
import { serviceDeployableFixture } from '~/src/__fixtures__/service-deployable'

describe('#toService', () => {
  const serviceId = 'cdp-portal-frontend'
  const mockFetchRepository = jest.fn()
  const mockFetchDeployableService = jest.fn()
  const notFound = {
    output: { statusCode: 404 },
    message: 'Not Found'
  }
  let mockRequest

  beforeEach(() => {
    mockRequest = {
      server: {
        methods: {
          fetchRepository: mockFetchRepository,
          fetchDeployableService: mockFetchDeployableService
        }
      }
    }
  })

  test('Should return expected service', async () => {
    mockFetchRepository.mockResolvedValue(repositoryFixture)
    mockFetchDeployableService.mockResolvedValue(serviceDeployableFixture)

    const result = await toService(serviceId, mockRequest)

    expect(result).toEqual({
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

  test('Should return deployable service without repository details when fetchRepository throws 404', async () => {
    mockFetchRepository.mockRejectedValue(notFound)
    mockFetchDeployableService.mockResolvedValue(serviceDeployableFixture)

    const result = await toService(serviceId, mockRequest)

    expect(result).toEqual({
      githubUrl: 'https://github.com/DEFRA',
      imageName: 'cdp-portal-frontend',
      isDeployable: true,
      serviceName: 'cdp-portal-frontend'
    })
  })
})
