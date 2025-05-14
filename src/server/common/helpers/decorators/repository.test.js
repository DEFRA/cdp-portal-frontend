import { config } from '~/src/config/config.js'
import { serviceFixture } from '~/src/__fixtures__/services/service.js'
import { repositoryFixture } from '~/src/__fixtures__/repository.js'
import { createServiceStatusToService } from '~/src/server/common/transformers/create-service-status-to-service.js'
import { createServiceStatusInProgressFixture } from '~/src/__fixtures__/create/service-status-in-progress.js'
import { repositoryDecorator } from '~/src/server/common/helpers/decorators/repository.js'
import { tenantServicesFixture } from '~/src/__fixtures__/tenant-services.js'

const githubOrg = config.get('githubOrg')

describe('#repositoryDecorator', () => {
  describe('With deployable service', () => {
    test('Should provide expected service when decorated with repository', () => {
      expect(repositoryDecorator(serviceFixture, repositoryFixture)).toEqual({
        createdAt: '2023-04-12T17:16:48+00:00',
        description: 'The Core Delivery Platform Portal.',
        githubUrl: `https://github.com/${githubOrg}/cdp-portal-frontend`,
        id: 'cdp-portal-frontend',
        imageName: 'cdp-portal-frontend',
        isArchived: false,
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

  describe('With a create service status', () => {
    test('Should provide expected service when decorated with repository', () => {
      expect(
        repositoryDecorator(
          createServiceStatusToService(createServiceStatusInProgressFixture),
          repositoryFixture
        )
      ).toEqual({
        createdAt: '2023-04-12T17:16:48+00:00',
        description: 'The Core Delivery Platform Portal.',
        githubUrl: 'https://github.com/DEFRA/cdp-portal-frontend',
        id: 'cdp-portal-frontend',
        isArchived: false,
        isCreateService: true,
        isPrivate: true,
        isTemplate: false,
        primaryLanguage: 'JavaScript',
        serviceName: 'cdp-portal-frontend',
        serviceStatus: createServiceStatusInProgressFixture,
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

  describe('With tenant services', () => {
    test('Should provide expected service when decorated with repository and tenant services', () => {
      expect(
        repositoryDecorator(
          createServiceStatusToService(createServiceStatusInProgressFixture),
          repositoryFixture,
          tenantServicesFixture
        )
      ).toEqual({
        createdAt: '2023-04-12T17:16:48+00:00',
        description: 'The Core Delivery Platform Portal.',
        githubUrl: 'https://github.com/DEFRA/cdp-portal-frontend',
        id: 'cdp-portal-frontend',
        isArchived: false,
        isCreateService: true,
        isPrivate: true,
        isTemplate: false,
        primaryLanguage: 'JavaScript',
        serviceName: 'cdp-portal-frontend',
        serviceStatus: createServiceStatusInProgressFixture,
        teams: [
          {
            github: 'cdp-platform',
            name: 'Platform',
            teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
          }
        ],
        topics: ['frontend', 'node', 'cdp', 'service'],
        tenantServices: tenantServicesFixture
      })
    })
  })

  describe('With meta', () => {
    test('Should provide expected service when decorated with repository and tenant services', () => {
      expect(
        repositoryDecorator(
          createServiceStatusToService(createServiceStatusInProgressFixture),
          repositoryFixture,
          tenantServicesFixture,
          { isPostgres: true }
        )
      ).toEqual({
        createdAt: '2023-04-12T17:16:48+00:00',
        description: 'The Core Delivery Platform Portal.',
        githubUrl: 'https://github.com/DEFRA/cdp-portal-frontend',
        id: 'cdp-portal-frontend',
        isArchived: false,
        isCreateService: true,
        isPrivate: true,
        isTemplate: false,
        primaryLanguage: 'JavaScript',
        serviceName: 'cdp-portal-frontend',
        serviceStatus: createServiceStatusInProgressFixture,
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

  describe('Without a repository', () => {
    test('Should provide expected service without repository decoration', () => {
      expect(
        repositoryDecorator(
          createServiceStatusToService(createServiceStatusInProgressFixture)
        )
      ).toEqual({
        githubUrl: 'https://github.com/DEFRA/cdp-portal-frontend',
        id: 'cdp-portal-frontend',
        isCreateService: true,
        serviceName: 'cdp-portal-frontend',
        serviceStatus: createServiceStatusInProgressFixture,
        teams: [
          {
            name: 'Platform',
            teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
          }
        ]
      })
    })
  })
})
