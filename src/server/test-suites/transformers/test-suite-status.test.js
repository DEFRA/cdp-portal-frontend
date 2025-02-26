import { config } from '~/src/config/config.js'
import { repositoryFixture } from '~/src/__fixtures__/repository.js'
import { createServiceStatusToService } from '~/src/server/common/transformers/create-service-status-to-service.js'
import { creatEnvTestSuiteStatusInProgressFixture } from '~/src/__fixtures__/create/env-test-suite-status-in-progress.js'
import { repositoryDecorator } from '~/src/server/common/helpers/decorators/repository.js'
import { testSuiteStatus } from '~/src/server/test-suites/transformers/test-suite-status.js'

const githubOrg = config.get('githubOrg')

describe('#testSuiteStatus', () => {
  test('Should provide expected transformed service status', () => {
    const service = repositoryDecorator(
      createServiceStatusToService(
        creatEnvTestSuiteStatusInProgressFixture.repositoryStatus
      ),
      repositoryFixture.repository
    )

    const status = testSuiteStatus(service)
    expect(status.cdpTfSvcInfra).toMatchObject({
      info: expect.any(Function),
      errors: [],
      githubAction: {
        name: 'Terraform Apply',
        started: '2023-10-27T12:40:27Z',
        url: {
          href: `https://github.com/${githubOrg}/cdp-tf-svc-infra/actions/runs/6667318902`,
          text: `${githubOrg}/cdp-tf-svc-infra/actions/runs/6667318902`
        }
      },
      name: 'Infrastructure',
      part: expect.any(Number),
      status: {
        classes: 'govuk-tag--blue',
        text: 'in-progress'
      },
      url: {
        href: `https://github.com/${githubOrg}/cdp-tf-svc-infra`,
        text: `${githubOrg}/cdp-tf-svc-infra`
      }
    })

    expect(status.cdpAppConfig).toMatchObject({
      info: expect.any(Function),
      errors: [],
      githubAction: {
        name: 'cdp-app-config',
        started: '2024-07-09T13:07:05.842Z',
        url: {
          href: 'https://github.com/DEFRA/cdp-app-config/actions/runs/1',
          text: 'DEFRA/cdp-app-config/actions/runs/1'
        }
      },
      name: 'Config',
      part: expect.any(Number),
      status: {
        classes: 'govuk-tag--green',
        text: 'success'
      },
      url: {
        href: 'https://github.com/DEFRA/cdp-app-config',
        text: 'DEFRA/cdp-app-config'
      }
    })

    expect(status.cdpSquidProxy).toMatchObject({
      info: expect.any(Function),
      errors: [],
      githubAction: {
        name: 'cdp-squid-proxy',
        started: '2024-07-09T13:07:05.842Z',
        url: {
          href: 'https://github.com/DEFRA/cdp-squid-proxy/actions/runs/1',
          text: 'DEFRA/cdp-squid-proxy/actions/runs/1'
        }
      },
      name: 'Proxy',
      part: expect.any(Number),
      status: {
        classes: 'govuk-tag--green',
        text: 'success'
      },
      url: {
        href: 'https://github.com/DEFRA/cdp-squid-proxy',
        text: 'DEFRA/cdp-squid-proxy'
      }
    })

    expect(status.createRepository).toMatchObject({
      info: expect.any(Function),
      name: 'GitHub Repository',
      part: expect.any(Number),
      status: {
        classes: 'govuk-tag--blue',
        text: 'in-progress'
      },
      url: {
        href: '',
        text: ''
      }
    })

    expect(status.progress).toMatchObject({
      complete: 2,
      percentage: expect.closeTo(50, 1),
      total: 4
    })

    expect(status.status).toMatchObject({
      classes: 'govuk-tag--blue',
      isSuccess: false,
      text: 'in-progress',
      value: 'in-progress'
    })
  })
})
