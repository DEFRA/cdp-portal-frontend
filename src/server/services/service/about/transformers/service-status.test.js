import { config } from '~/src/config/config.js'
import { repositoryFixture } from '~/src/__fixtures__/repository.js'
import { serviceStatus } from '~/src/server/services/service/about/transformers/service-status.js'
import { createServiceStatusInProgressFixture } from '~/src/__fixtures__/create/service-status-in-progress.js'
import { createServiceStatusToService } from '~/src/server/common/transformers/create-service-status-to-service.js'
import { repositoryDecorator } from '~/src/server/common/helpers/decorators/repository.js'

const githubOrg = config.get('githubOrg')

describe('#serviceStatus', () => {
  test('Should provide expected transformed service status', () => {
    const service = repositoryDecorator(
      createServiceStatusToService(createServiceStatusInProgressFixture),
      repositoryFixture.repository
    )

    const result = serviceStatus(service)

    expect(result.cdpAppConfig).toEqual(
      expect.objectContaining({
        errors: [],
        githubAction: {
          name: 'cdp-portal-frontend',
          started: '2023-10-27T12:38:40Z',
          url: {
            href: `https://github.com/${githubOrg}/cdp-app-config/actions/runs/6667297592`,
            text: 'DEFRA/cdp-app-config/actions/runs/6667297592'
          }
        },
        info: expect.any(Function),
        name: 'Config',
        part: 2,
        status: {
          classes: 'govuk-tag--blue',
          text: 'in-progress'
        }
      })
    )

    expect(result.cdpNginxUpstreams).toEqual(
      expect.objectContaining({
        errors: [],
        githubAction: {
          name: 'cdp-portal-frontend',
          started: '2023-10-27T12:39:01Z',
          url: {
            href: `https://github.com/${githubOrg}/cdp-nginx-upstreams/actions/runs/6667301828`,
            text: `${githubOrg}/cdp-nginx-upstreams/actions/runs/6667301828`
          }
        },
        info: expect.any(Function),
        name: 'Networking',
        part: 3,
        status: {
          classes: 'govuk-tag--blue',
          text: 'in-progress'
        },
        url: {
          href: `https://github.com/${githubOrg}/cdp-nginx-upstreams`,
          text: `${githubOrg}/cdp-nginx-upstreams`
        }
      })
    )

    expect(result.cdpTfSvcInfra).toEqual(
      expect.objectContaining({
        errors: [],
        githubAction: {
          name: 'cdp-portal-frontend',
          started: '2023-10-27T12:40:27Z',
          url: {
            href: `https://github.com/${githubOrg}/cdp-tf-svc-infra/actions/runs/6667318902`,
            text: `${githubOrg}/cdp-tf-svc-infra/actions/runs/6667318902`
          }
        },
        info: expect.any(Function),
        name: 'Infrastructure',
        part: 6,
        status: {
          classes: 'govuk-tag--blue',
          text: 'in-progress'
        },
        url: {
          href: `https://github.com/${githubOrg}/cdp-tf-svc-infra`,
          text: `${githubOrg}/cdp-tf-svc-infra`
        }
      })
    )

    expect(result.cdpSquidProxy).toEqual(
      expect.objectContaining({
        errors: [],
        githubAction: {
          name: 'cdp-portal-frontend',
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
          text: 'in-progress'
        },
        url: {
          href: 'https://github.com/DEFRA/cdp-squid-proxy',
          text: 'DEFRA/cdp-squid-proxy'
        }
      })
    )

    expect(result.cdpDashboard).toEqual(
      expect.objectContaining({
        errors: [],
        githubAction: {
          name: 'cdp-portal-frontend',
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
          text: 'in-progress'
        },
        url: {
          href: 'https://github.com/DEFRA/cdp-grafana-svc',
          text: 'DEFRA/cdp-grafana-svc'
        }
      })
    )

    expect(result.status).toEqual({
      classes: 'govuk-tag--blue',
      isSuccess: false,
      text: 'in-progress',
      value: 'in-progress'
    })

    expect(result.hasJobFailures).toBe(false)
    expect(result.progress.complete).toBe(1)
    expect(result.progress.total).toBe(6)
  })
})
