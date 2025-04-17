import { repositoryFixture } from '~/src/__fixtures__/repository.js'
import { serviceDeployableFixture } from '~/src/__fixtures__/services/service-deployable.js'
import { provideService } from '~/src/server/common/helpers/provide-service.js'
import { fetchRepository } from '~/src/server/services/helpers/fetch/fetch-repository.js'
import { fetchDeployableService } from '~/src/server/common/helpers/fetch/fetch-deployable-service.js'
import { fetchTenantService } from '~/src/server/common/helpers/fetch/fetch-tenant-service.js'
import { tenantServicesFixture } from '~/src/__fixtures__/tenant-services.js'

jest.mock('~/src/server/services/helpers/fetch/fetch-repository.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-deployable-service.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-tenant-service.js')

describe('#provideService', () => {
  const serviceId = 'cdp-portal-frontend'
  const mockResponseToolkit = {
    continue: 'mockContinue'
  }
  let mockRequest

  describe('When serviceId is provided', () => {
    beforeEach(() => {
      mockRequest = {
        params: { serviceId },
        app: {}
      }
    })

    test('Should assign service to request.app', async () => {
      fetchRepository.mockResolvedValue(repositoryFixture)
      fetchDeployableService.mockResolvedValue(serviceDeployableFixture)
      fetchTenantService.mockResolvedValue(tenantServicesFixture)

      const result = await provideService(mockRequest, mockResponseToolkit)

      expect(result).toEqual(mockResponseToolkit.continue)
      expect(mockRequest.app.service).toEqual({
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
        isTestSuite: false,
        primaryLanguage: 'JavaScript',
        serviceName: 'cdp-portal-frontend',
        teams: [
          {
            github: 'cdp-platform',
            name: 'Platform',
            teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
          }
        ],
        topics: ['frontend', 'node', 'cdp', 'service'],
        tenantServices: tenantServicesFixture,
        isPostgres: true
      })
    })
  })

  describe('When serviceId is NOT provided', () => {
    beforeEach(() => {
      mockRequest = {
        params: {},
        app: {}
      }
    })

    test('Should not assign service to request.app', async () => {
      fetchRepository.mockResolvedValue(repositoryFixture)
      fetchDeployableService.mockResolvedValue(serviceDeployableFixture)

      const result = await provideService(mockRequest, mockResponseToolkit)

      expect(result).toEqual(mockResponseToolkit.continue)
      expect(mockRequest.app.service).toBeUndefined()
    })
  })
})
