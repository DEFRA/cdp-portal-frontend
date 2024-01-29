import { config } from '~/src/config'
import { repositoryFixture } from '~/src/__fixtures__/repository'
import { decorateService } from '~/src/server/services/helpers/decorate-service'
import { transformCreateServiceStatusToService } from '~/src/server/services/transformers/transform-create-service-status-to-service'
import { creatEnvTestSuiteStatusInProgressFixture } from '~/src/__fixtures__/create/env-test-suite-status-in-progress'
import { transformEnvTestSuiteStatus } from '~/src/server/services/transformers/transform-env-test-suite-status'

const githubOrg = config.get('githubOrg')

describe('#transformEnvTestSuiteStatus', () => {
  test('Should provide expected transformed service status', () => {
    const service = decorateService(
      transformCreateServiceStatusToService(
        creatEnvTestSuiteStatusInProgressFixture.repositoryStatus
      ),
      repositoryFixture.repository
    )

    expect(transformEnvTestSuiteStatus(service)).toEqual(
      expect.objectContaining({
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
          part: 2,
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
          name: 'Github Repository',
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
          complete: 0,
          percentage: 0,
          total: 2
        },
        started: '2023-11-22T09:28:57.925Z',
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
