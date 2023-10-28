import { config } from '~/src/config'
import { transformStatus } from '~/src/server/services/transformers/transform-status'
import { createServiceStatusFixture } from '~/src/__fixtures__/create-service-status'

const githubOrg = config.get('githubOrg')

describe('#transformStatus', () => {
  test('Should provide expected transformed service status', () => {
    expect(transformStatus(createServiceStatusFixture.status)).toEqual({
      cdpAppConfig: {
        githubAction: {
          name: 'Upload config to s3 (infra-dev)',
          started: '2023-10-27T12:38:40Z',
          url: {
            href: `https://github.com/${githubOrg}/cdp-app-config/actions/runs/6667297592`,
            text: `${githubOrg}/cdp-app-config/actions/runs/6667297592`
          }
        },
        name: 'Create App Config',
        pullRequest: {
          url: {
            href: `https://github.com/${githubOrg}/cdp-app-config/pull/180`,
            text: `${githubOrg}/cdp-app-config/pull/180`
          }
        },
        status: {
          classes: 'govuk-tag--green',
          text: 'success'
        },
        url: {
          href: `https://github.com/${githubOrg}/cdp-app-config`,
          text: `${githubOrg}/cdp-app-config`
        }
      },
      cdpNginxUpstreams: {
        githubAction: {
          name: 'Push to S3',
          started: '2023-10-27T12:39:01Z',
          url: {
            href: `https://github.com/${githubOrg}/cdp-nginx-upstreams/actions/runs/6667301828`,
            text: `${githubOrg}/cdp-nginx-upstreams/actions/runs/6667301828`
          }
        },
        name: 'Create Nginx Upstreams',
        pullRequest: {
          url: {
            href: `https://github.com/${githubOrg}/cdp-nginx-upstreams/pull/123`,
            text: `${githubOrg}/cdp-nginx-upstreams/pull/123`
          }
        },
        status: {
          classes: 'govuk-tag--green',
          text: 'success'
        },
        url: {
          href: `https://github.com/${githubOrg}/cdp-nginx-upstreams`,
          text: `${githubOrg}/cdp-nginx-upstreams`
        }
      },
      cdpTfSvcInfra: {
        githubAction: {
          name: 'Terraform Apply',
          started: '2023-10-27T12:40:27Z',
          url: {
            href: `https://github.com/${githubOrg}/cdp-tf-svc-infra/actions/runs/6667318902`,
            text: `${githubOrg}/cdp-tf-svc-infra/actions/runs/6667318902`
          }
        },
        name: 'Create Infrastructure',
        pullRequest: {
          url: {
            href: `https://github.com/${githubOrg}/cdp-tf-svc-infra/pull/309`,
            text: `${githubOrg}/cdp-tf-svc-infra/pull/309`
          }
        },
        status: {
          classes: 'govuk-tag--green',
          text: 'success'
        },
        url: {
          href: `https://github.com/${githubOrg}/cdp-tf-svc-infra`,
          text: `${githubOrg}/cdp-tf-svc-infra`
        }
      },
      createRepository: {
        name: 'Create Repository',
        status: {
          classes: 'govuk-tag--green',
          text: 'success'
        },
        url: {
          href: null
        }
      },
      started: '2023-10-27T12:37:46.915Z',
      status: {
        classes: 'govuk-tag--blue',
        text: 'in-progress'
      }
    })
  })
})
