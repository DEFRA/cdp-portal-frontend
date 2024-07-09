import { config } from '~/src/config'
import { repositoryFixture } from '~/src/__fixtures__/repository'
import { createServiceStatusToService } from '~/src/server/common/transformers/create-service-status-to-service'
import { creatEnvTestSuiteStatusInProgressFixture } from '~/src/__fixtures__/create/env-test-suite-status-in-progress'
import { repositoryDecorator } from '~/src/server/common/helpers/decorators/repository'
import { testSuiteStatus } from '~/src/server/test-suites/transformers/test-suite-status'

const githubOrg = config.get('githubOrg')

describe('#testSuiteStatus', () => {
  test('Should provide expected transformed service status', () => {
    const service = repositoryDecorator(
      createServiceStatusToService(
        creatEnvTestSuiteStatusInProgressFixture.repositoryStatus
      ),
      repositoryFixture.repository
    )

    expect(testSuiteStatus(service)).toMatchObject({
      cdpTfSvcInfra: {
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
        part: 3,
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
      cdpSquidProxy: {
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
        part: 2,
        status: {
          classes: 'govuk-tag--green',
          text: 'Success'
        },
        url: {
          href: 'https://github.com/DEFRA/cdp-squid-proxy',
          text: 'DEFRA/cdp-squid-proxy'
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
          href: `https://github.com/${githubOrg}/cdp-env-test-suite`,
          text: `${githubOrg}/cdp-env-test-suite`
        }
      },
      hasJobFailures: false,
      progress: {
        complete: 1,
        percentage: 33.333333333333336,
        total: 3
      },
      started: '2023-11-22T09:28:57.925Z',
      serviceTypeTemplate: undefined,
      status: {
        classes: 'govuk-tag--blue',
        isSuccess: false,
        text: 'In Progress',
        value: 'in-progress'
      }
    })
  })
})
