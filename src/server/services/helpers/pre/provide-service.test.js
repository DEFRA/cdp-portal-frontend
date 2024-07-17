import { provideService } from '~/src/server/services/helpers/pre/provide-service'
import { fetchRepository } from '~/src/server/services/helpers/fetch/fetch-repository'
import { fetchDeployableService } from '~/src/server/common/helpers/fetch/fetch-deployable-service'
import { serviceDeployableFixture } from '~/src/__fixtures__/service-deployable'
import { repositoryFixture } from '~/src/__fixtures__/repository'

jest.mock('~/src/server/services/helpers/fetch/fetch-repository')
jest.mock('~/src/server/common/helpers/fetch/fetch-deployable-service')

describe('#provideService', () => {
  const mockRequest = {
    params: { serviceId: 'cdp-portal-frontend' },
    server: {
      methods: {
        fetchDeployableService
      }
    }
  }

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('With a deployable service', () => {
    beforeEach(() => {
      fetchDeployableService.mockResolvedValue(serviceDeployableFixture)
      fetchRepository.mockResolvedValue(repositoryFixture)
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
