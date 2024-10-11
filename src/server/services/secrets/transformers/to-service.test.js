import { toService } from '~/src/server/services/secrets/transformers/to-service'
import { repositoryFixture } from '~/src/__fixtures__/repository'
import { serviceDeployableFixture } from '~/src/__fixtures__/service-deployable'
import { fetchRepository } from '~/src/server/services/helpers/fetch/fetch-repository'
import { fetchDeployableService } from '~/src/server/common/helpers/fetch/fetch-deployable-service'

jest.mock('~/src/server/services/helpers/fetch/fetch-repository')
jest.mock('~/src/server/common/helpers/fetch/fetch-deployable-service')

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
