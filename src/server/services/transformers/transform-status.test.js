import { config } from '~/src/config'
import { transformStatus } from '~/src/server/services/transformers/transform-status'
import { decorateService } from '~/src/server/services/transformers/decorate-service'
import { repositoryFixture } from '~/src/__fixtures__/repository'
import { transformUnfinishedToService } from '~/src/server/services/transformers/transform-unfinished-to-service'
import { unfinishedServiceStatusFixture } from '~/src/__fixtures__/unfinished-service-status'

const githubOrg = config.get('githubOrg')

describe('#transformStatus', () => {
  test('Should provide expected transformed service status', () => {
    const service = decorateService(
      transformUnfinishedToService(unfinishedServiceStatusFixture.unfinished),
      repositoryFixture.repository
    )

    expect(transformStatus(service)).toEqual(
      expect.objectContaining({
        cdpAppConfig: {
          errors: [],
          githubAction: {
            name: 'Upload config to s3 (infra-dev)',
            started: '2023-10-27T12:38:40Z',
            url: {
              href: `https://github.com/${githubOrg}/cdp-app-config/actions/runs/6667297592`,
              text: `${githubOrg}/cdp-app-config/actions/runs/6667297592`
            }
          },
          info: expect.any(Function),
          name: 'Config',
          part: 2,
          pullRequest: {
            url: {
              href: `https://github.com/${githubOrg}/cdp-app-config/pull/180`,
              text: `${githubOrg}/cdp-app-config/pull/180`
            }
          },
          status: {
            classes: 'govuk-tag--green',
            text: 'Success'
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
            classes: 'govuk-tag--green',
            text: 'Success'
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
          part: 4,
          pullRequest: {
            url: {
              href: `https://github.com/${githubOrg}/cdp-tf-svc-infra/pull/309`,
              text: `${githubOrg}/cdp-tf-svc-infra/pull/309`
            }
          },
          status: {
            classes: 'govuk-tag--green',
            text: 'Success'
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
            classes: 'govuk-tag--green',
            text: 'Success'
          },
          url: {
            href: `https://github.com/${githubOrg}/cdp-portal-frontend`,
            text: `${githubOrg}/cdp-portal-frontend`
          }
        },
        hasJobFailures: false,
        progress: {
          complete: 4,
          percentage: 100,
          total: 4
        },
        serviceTypeTemplate: 'cdp-node-backend-template',
        started: '2023-10-27T12:37:46.915Z',
        status: {
          classes: 'govuk-tag--green',
          isSuccess: true,
          text: 'Success',
          value: 'success'
        }
      })
    )
  })
})
