import { config } from '~/src/config/config.js'
import { repositoriesFixture } from '~/src/__fixtures__/repositories.js'
import { servicesFixture } from '~/src/__fixtures__/services.js'
import { createServicesStatusesFixture } from '~/src/__fixtures__/create-services-statuses.js'
import { repositoriesDecorator } from '~/src/server/common/helpers/decorators/repositories.js'

const githubOrg = config.get('githubOrg')

describe('#repositoriesDecorator', () => {
  const decorator = repositoriesDecorator(repositoriesFixture.repositories)

  describe('With deployable services', () => {
    test('Should provide expected service when decorated with repository', () => {
      expect(servicesFixture.map(decorator)).toEqual([
        {
          createdAt: '2023-04-12T17:16:48+00:00',
          description:
            'The Core Delivery Platform Portal. A Node.js frontend application built with Hapi.js. Helping Defra teams to create, deploy, run and monitor applications on the Core Delivery Platform.',
          githubUrl: 'https://github.com/DEFRA/cdp-portal-frontend',
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
        },
        {
          githubUrl: 'https://github.com/DEFRA/cdp-user-service-backend',
          imageName: 'cdp-user-service-backend',
          serviceName: 'cdp-user-service-backend',
          teams: [
            {
              github: 'cdp-platform',
              name: 'Platform',
              teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
            }
          ]
        },
        {
          githubUrl: 'https://github.com/DEFRA/forms-designer',
          imageName: 'forms-designer',
          serviceName: 'forms-designer',
          teams: [
            {
              github: 'forms',
              name: 'Forms',
              teamId: '0be2f4a1-3e1c-4675-a8ec-3af6d453b7ca'
            }
          ]
        }
      ])
    })
  })

  describe('With create service status service', () => {
    test('Should provide expected service when decorated with repository', () => {
      expect(createServicesStatusesFixture.statuses.map(decorator)).toEqual([
        {
          ...createServicesStatusesFixture.statuses.at(0),
          kind: 'repository',
          org: githubOrg,
          portalVersion: 2,
          repositoryName: 'cdp-portal-frontend',
          serviceType: 'cdp-node-backend-template',
          started: '2023-10-27T12:37:46.915Z',
          status: 'in-progress',
          team: {
            name: 'Platform',
            teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
          },
          zone: 'protected'
        }
      ])
    })
  })
})
