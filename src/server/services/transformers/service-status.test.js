import { config } from '~/src/config'
import { repositoryFixture } from '~/src/__fixtures__/repository'
import { serviceStatus } from '~/src/server/services/transformers/service-status'
import { createServiceStatusInProgressFixture } from '~/src/__fixtures__/create/service-status-in-progress'
import { createServiceStatusToService } from '~/src/server/common/transformers/create-service-status-to-service'
import { repositoryDecorator } from '~/src/server/common/helpers/decorators/repository'

const githubOrg = config.get('githubOrg')

describe('#serviceStatus', () => {
  test('Should provide expected transformed service status', () => {
    const service = repositoryDecorator(
      createServiceStatusToService(
        createServiceStatusInProgressFixture.repositoryStatus
      ),
      repositoryFixture.repository
    )

    expect(serviceStatus(service)).toEqual(
      expect.objectContaining({
        cdpAppConfig: {
          errors: [],
          githubAction: {
            name: 'Upload config to s3 (infra-dev)',
            started: '2023-10-27T12:38:40Z',
            url: {
              href: `https://github.com/${githubOrg}/cdp-app-config/actions/runs/6667297592`,
              text: 'DEFRA/cdp-app-config/actions/runs/6667297592'
            }
          },
          info: expect.any(Function),
          name: 'Config',
          part: 2,
          pullRequest: {
            url: {
              href: `https://github.com/${githubOrg}/cdp-app-config/pull/180`,
              text: 'DEFRA/cdp-app-config/pull/180'
            }
          },
          status: {
            classes: 'govuk-tag--blue',
            text: 'In Progress'
          },
          url: {
            href: `https://github.com/${githubOrg}/cdp-app-config`,
            text: `${githubOrg}/cdp-app-config`
          }
        },
        cdpNginxUpstreams: {
          errors: [],
          githubAction: {
            name: 'Push to S3',
            started: '2023-10-27T12:39:01Z',
            url: {
              href: `https://github.com/${githubOrg}/cdp-nginx-upstreams/actions/runs/6667301828`,
              text: `${githubOrg}/cdp-nginx-upstreams/actions/runs/6667301828`
            }
          },
          info: expect.any(Function),
          name: 'Networking',
          part: 3,
          pullRequest: {
            url: {
              href: `https://github.com/${githubOrg}/cdp-nginx-upstreams/pull/123`,
              text: `${githubOrg}/cdp-nginx-upstreams/pull/123`
            }
          },
          status: {
            classes: 'govuk-tag--blue',
            text: 'In Progress'
          },
          url: {
            href: `https://github.com/${githubOrg}/cdp-nginx-upstreams`,
            text: `${githubOrg}/cdp-nginx-upstreams`
          }
        },
        cdpTfSvcInfra: {
          errors: [],
          githubAction: {
            name: 'Terraform Apply',
            started: '2023-10-27T12:40:27Z',
            url: {
              href: `https://github.com/${githubOrg}/cdp-tf-svc-infra/actions/runs/6667318902`,
              text: `${githubOrg}/cdp-tf-svc-infra/actions/runs/6667318902`
            }
          },
          info: expect.any(Function),
          name: 'Infrastructure',
          part: 6,
          pullRequest: {
            url: {
              href: `https://github.com/${githubOrg}/cdp-tf-svc-infra/pull/309`,
              text: `${githubOrg}/cdp-tf-svc-infra/pull/309`
            }
          },
          status: {
            classes: 'govuk-tag--blue',
            text: 'In Progress'
          },
          url: {
            href: `https://github.com/${githubOrg}/cdp-tf-svc-infra`,
            text: `${githubOrg}/cdp-tf-svc-infra`
          }
        },
        createRepository: {
          info: expect.any(Function),
          name: 'GitHub Repository',
          part: 1,
          status: {
            classes: 'govuk-tag--blue',
            text: 'In Progress'
          },
          url: {
            href: `https://github.com/${githubOrg}/cdp-portal-frontend`,
            text: `${githubOrg}/cdp-portal-frontend`
          }
        },
        cdpSquidProxy: {
          errors: [],
          githubAction: {
            name: 'final-perf-test-1',
            started: '2024-07-09T13:07:05.842Z',
            url: {
              href: 'http://localhost:3939/#local-stub',
              text: '#local-stub'
            }
          },
          info: expect.any(Function),
          name: 'Proxy',
          part: 4,
          status: {
            classes: 'govuk-tag--blue',
            text: 'In Progress'
          },
          url: {
            href: 'https://github.com/DEFRA/cdp-squid-proxy',
            text: 'DEFRA/cdp-squid-proxy'
          }
        },
        cdpDashboard: {
          errors: [],
          githubAction: {
            name: 'final-perf-test-1',
            started: '2024-07-09T13:07:05.842Z',
            url: {
              href: 'http://localhost:3939/#local-stub',
              text: '#local-stub'
            }
          },
          info: expect.any(Function),
          name: 'Dashboards',
          part: 5,
          status: {
            classes: 'govuk-tag--blue',
            text: 'In Progress'
          },
          url: {
            href: 'https://github.com/DEFRA/cdp-grafana-svc',
            text: 'DEFRA/cdp-grafana-svc'
          }
        },

        hasJobFailures: false,
        progress: {
          complete: 0,
          percentage: 0,
          total: 6
        },
        serviceTypeTemplate: 'cdp-node-backend-template',
        started: '2023-10-27T12:37:46.915Z',
        status: {
          classes: 'govuk-tag--blue',
          isSuccess: false,
          text: 'In Progress',
          value: 'in-progress'
        }
      })
    )
  })
})
