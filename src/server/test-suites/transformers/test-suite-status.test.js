import { repositoryFixture } from '~/src/__fixtures__/repository'
import { createServiceStatusToService } from '~/src/server/common/transformers/create-service-status-to-service'
import { creatEnvTestSuiteStatusInProgressFixture } from '~/src/__fixtures__/create/env-test-suite-status-in-progress'
import { repositoryDecorator } from '~/src/server/common/helpers/decorators/repository'
import { testSuiteStatus } from '~/src/server/test-suites/transformers/test-suite-status'

describe('#testSuiteStatus', () => {
  test('Should provide expected transformed service status', () => {
    const service = repositoryDecorator(
      createServiceStatusToService(
        creatEnvTestSuiteStatusInProgressFixture.repositoryStatus
      ),
      repositoryFixture.repository
    )

    expect(testSuiteStatus(service)).toEqual(
      expect.objectContaining({
        cdpTfSvcInfra: {
          errors: [],
          githubAction: {
            name: 'Terraform Apply',
            started: '2023-10-27T12:40:27Z',
            url: {
              href: `https://github.com/DEFRA/cdp-tf-svc-infra/actions/runs/6667318902`,
              text: `DEFRA/cdp-tf-svc-infra/actions/runs/6667318902`
            }
          },
          info: expect.any(Function),
          name: 'Infrastructure',
          part: 2,
          pullRequest: {
            url: {
              href: `https://github.com/DEFRA/cdp-tf-svc-infra/pull/309`,
              text: `DEFRA/cdp-tf-svc-infra/pull/309`
            }
          },
          status: {
            classes: 'govuk-tag--blue',
            text: 'In Progress'
          },
          url: {
            href: `https://github.com/DEFRA/cdp-tf-svc-infra`,
            text: 'cdp-tf-svc-infra'
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
            href: `https://github.com/DEFRA/cdp-env-test-suite`,
            text: 'cdp-env-test-suite'
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
