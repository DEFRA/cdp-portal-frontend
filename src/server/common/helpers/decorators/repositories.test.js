import { config } from '~/src/config'
import { repositoriesFixture } from '~/src/__fixtures__/repositories'
import { servicesFixture } from '~/src/__fixtures__/services'
import { createServicesStatusesFixture } from '~/src/__fixtures__/create-services-statuses'
import { repositoriesDecorator } from '~/src/server/common/helpers/decorators/repositories'
import { omit } from 'lodash'

const githubOrg = config.get('githubOrg')

describe('#repositoriesDecorator', () => {
  const decorator = repositoriesDecorator(repositoriesFixture.repositories)

  describe('With deployable services', () => {
    test('Should provide expected service when decorated with repository', () => {
      expect(servicesFixture.map(decorator)).toEqual([
        {
          ...omit(
            repositoriesFixture.repositories.find(
              (repo) => repo.id === 'cdp-portal-frontend'
            ),
            ['url']
          ),
          githubUrl: `https://github.com/${githubOrg}/cdp-portal-frontend`,
          imageName: 'cdp-portal-frontend',
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
          githubUrl: `https://github.com/${githubOrg}/cdp-user-service-backend`,
          imageName: 'cdp-user-service-backend',
          serviceName: 'cdp-user-service-backend',
          teams: [
            {
              github: 'cdp-platform',
              name: 'Platform',
              teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
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
