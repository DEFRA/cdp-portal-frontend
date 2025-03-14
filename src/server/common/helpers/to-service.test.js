import { toService } from '~/src/server/common/helpers/to-service.js'
import {
  repositoryFixture,
  repositoryTestSuiteFixture
} from '~/src/__fixtures__/repository.js'
import { serviceDeployableFixture } from '~/src/__fixtures__/services/service-deployable.js'
import { fetchRepository } from '~/src/server/services/helpers/fetch/fetch-repository.js'
import { fetchDeployableService } from '~/src/server/common/helpers/fetch/fetch-deployable-service.js'
import { testSuiteFixture } from '~/src/__fixtures__/test-suite.js'

jest.mock('~/src/server/services/helpers/fetch/fetch-repository.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-deployable-service.js')

describe('#toService', () => {
  const serviceId = 'cdp-portal-frontend'
  const notFound = {
    output: { statusCode: 404 },
    message: 'Not Found'
  }

  describe('With Deployable Service and Repository details', () => {
    test('Should return expected service', async () => {
      fetchRepository.mockResolvedValue(repositoryFixture)
      fetchDeployableService.mockResolvedValue(serviceDeployableFixture)

      const result = await toService(serviceId)

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
        topics: ['frontend', 'node', 'cdp', 'service']
      })
    })
  })

  describe('With Deployable Test suite and Repository details', () => {
    test('Should return expected test suite', async () => {
      fetchRepository.mockResolvedValue(repositoryTestSuiteFixture)
      fetchDeployableService.mockResolvedValue(testSuiteFixture)

      const result = await toService(repositoryTestSuiteFixture.repository.id)

      expect(result).toEqual({
        createdAt: '2024-12-18T14:40:13+00:00',
        description: 'Git repository for service cdp-bc-journey-test-suite',
        githubUrl: 'https://github.com/DEFRA/cdp-portal-smoke-tests',
        id: 'cdp-bc-journey-test-suite',
        imageName: 'cdp-portal-smoke-tests',
        isArchived: false,
        isBackend: false,
        isDeployable: true,
        isFrontend: false,
        isPrivate: false,
        isTemplate: false,
        isTestSuite: true,
        primaryLanguage: 'JavaScript',
        serviceName: 'cdp-portal-smoke-tests',
        teams: [
          {
            github: 'cdp-platform',
            name: 'Platform',
            teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
          }
        ],
        topics: ['cdp', 'journey', 'test', 'test-suite']
      })
    })
  })

  describe('When fetchRepository throws 404', () => {
    test('Should return deployable service without repository details', async () => {
      fetchRepository.mockRejectedValue(notFound)
      fetchDeployableService.mockResolvedValue(serviceDeployableFixture)

      const result = await toService(serviceId)

      expect(result).toEqual({
        githubUrl: 'https://github.com/DEFRA',
        imageName: 'cdp-portal-frontend',
        isDeployable: true,
        serviceName: 'cdp-portal-frontend'
      })
    })
  })

  describe('With no Deployable Service or Repository details', () => {
    test('Should return "null"', async () => {
      fetchRepository.mockRejectedValue(notFound)
      fetchDeployableService.mockResolvedValue(null)

      const result = await toService(serviceId)

      expect(result).toBeNull()
    })
  })
})
