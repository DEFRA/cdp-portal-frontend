import { decorateServices } from '~/src/server/services/helpers/decorate-services'
import { config } from '~/src/config'
import { repositoriesFixture } from '~/src/__fixtures__/repositories'
import { servicesFixture } from '~/src/__fixtures__/services'
import { createServicesStatusesFixture } from '~/src/__fixtures__/create-services-statuses'

const githubOrg = config.get('githubOrg')

describe('#decorateServices', () => {
  const decorator = decorateServices(repositoriesFixture.repositories)

  describe('With deployable services', () => {
    test('Should provide expected service when decorated with repository', () => {
      expect(servicesFixture.map(decorator)).toEqual([
        {
          createdAt: '2023-04-12T17:16:48+00:00',
          description:
            'The Core Delivery Platform Portal. A Node.js frontend application built with Hapi.js. Helping Defra teams to create, deploy, run and monitor applications on the Core Delivery Platform.',
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
          'cdp-app-config': {
            main: {
              workflow: {
                created_at: '2023-10-27T12:38:40Z',
                html_url: `https://github.com/${githubOrg}/cdp-app-config/actions/runs/6667297592`,
                id: 6667297592,
                name: 'Upload config to s3 (infra-dev)',
                path: '.github/workflows/infra-dev-update-config.yml',
                updated_at: '2023-10-27T12:39:14Z'
              }
            },
            merged_sha: '1717bb6a43ad21fb12e4545e4194d7bb3fb4dcf7',
            pr: {
              html_url: `https://github.com/${githubOrg}/cdp-app-config/pull/180`,
              node_id: 'PR_kwDOJ1mq8M5d9__U',
              number: 180,
              ref: 'add-cdp-portal-frontend-config-1698410297725',
              sha: 'ebb9ac9e250c7849ed79a5c9a1e1eef1a3b15d83'
            },
            status: 'success'
          },
          'cdp-nginx-upstreams': {
            main: {
              workflow: {
                created_at: '2023-10-27T12:39:01Z',
                html_url: `https://github.com/${githubOrg}/cdp-nginx-upstreams/actions/runs/6667301828`,
                id: 6667301828,
                name: 'Push to S3',
                path: '.github/workflows/push.yml',
                updated_at: '2023-10-27T12:39:47Z'
              }
            },
            merged_sha: '2395d47bec5c9692c0d56bafbbc40d2533627ec6',
            pr: {
              html_url: `https://github.com/${githubOrg}/cdp-nginx-upstreams/pull/123`,
              node_id: 'PR_kwDOJxxeSs5d-AAl',
              number: 123,
              ref: 'add-cdp-portal-frontend-config-1698410301096',
              sha: '40ad087c9195ee541318c760531ca33e586ecaee'
            },
            status: 'success'
          },
          'cdp-tf-svc-infra': {
            main: {
              workflow: {
                created_at: '2023-10-27T12:40:27Z',
                html_url: `https://github.com/${githubOrg}/cdp-tf-svc-infra/actions/runs/6667318902`,
                id: 6667318902,
                name: 'Terraform Apply',
                path: '.github/workflows/apply.yml',
                updated_at: '2023-10-27T12:43:55Z'
              }
            },
            merged_sha: 'b622ed3e68d7ecab868d700fbe73b8696e7a39dc',
            pr: {
              html_url: `https://github.com/${githubOrg}/cdp-tf-svc-infra/pull/309`,
              node_id: 'PR_kwDOJVWcQM5d9_9_',
              number: 309,
              ref: 'add-cdp-portal-frontend-to-tenant-services-1698410293717',
              sha: 'e8bdd73d9380f4417d9fc7701518e4c0d8ab6e67'
            },
            status: 'success'
          },
          createRepository: {
            result: {},
            status: 'failed',
            url: `https://github.com/${githubOrg}`
          },
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
