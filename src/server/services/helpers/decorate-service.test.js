import { config } from '~/src/config'
import { serviceFixture } from '~/src/__fixtures__/service'
import { repositoryFixture } from '~/src/__fixtures__/repository'
import { decorateService } from '~/src/server/services/helpers/decorate-service'
import { transformCreateServiceStatusToService } from '~/src/server/services/transformers/transform-create-service-status-to-service'
import { createServiceStatusInProgressFixture } from '~/src/__fixtures__/create/service-status-in-progress'

const githubOrg = config.get('githubOrg')

describe('#decorateService', () => {
  describe('With deployable service', () => {
    test('Should provide expected service when decorated with repository', () => {
      expect(
        decorateService(serviceFixture, repositoryFixture.repository)
      ).toEqual({
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
        ]
      })
    })
  })

  describe('With a create service status', () => {
    test('Should provide expected service when decorated with repository', () => {
      expect(
        decorateService(
          transformCreateServiceStatusToService(
            createServiceStatusInProgressFixture.repositoryStatus
          ),
          repositoryFixture.repository
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
        serviceStatus: createServiceStatusInProgressFixture.repositoryStatus,
        teams: [
          {
            github: 'cdp-platform',
            name: 'Platform',
            teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
          }
        ]
      })
    })
  })
})
