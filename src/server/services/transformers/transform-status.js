import { config } from '~/src/config'
import { unknownValue } from '~/src/server/common/constants/no-value'
import { statusTagClassMap } from '~/src/server/services/transformers/status-tag-class-map'
import { removeHost } from '~/src/server/common/helpers/remove-host'

const githubOrg = config.get('githubOrg')

function transformStatus(serviceStatus) {
  const cdpTfSvcInfra = serviceStatus?.['cdp-tf-svc-infra']
  const cdpAppConfig = serviceStatus?.['cdp-app-config']
  const cdpNginxUpstreams = serviceStatus?.['cdp-nginx-upstreams']

  return {
    started: serviceStatus?.started,
    status: {
      text: serviceStatus?.status ?? unknownValue,
      classes: statusTagClassMap(serviceStatus?.status)
    },
    createRepository: {
      name: 'Create Repository',
      url: {
        text: serviceStatus?.githubUrl,
        href: removeHost(serviceStatus?.githubUrl)
      },
      status: {
        text: serviceStatus?.createRepository?.status ?? unknownValue,
        classes: statusTagClassMap(serviceStatus?.createRepository?.status)
      }
    },
    cdpTfSvcInfra: {
      name: 'Create Infrastructure',
      url: {
        text: `${githubOrg}/cdp-tf-svc-infra`,
        href: `https://github.com/${githubOrg}/cdp-tf-svc-infra`
      },
      status: {
        text: cdpTfSvcInfra?.status ?? unknownValue,
        classes: statusTagClassMap(cdpTfSvcInfra?.status)
      },
      pullRequest: {
        url: {
          text: removeHost(cdpTfSvcInfra?.pr?.html_url),
          href: cdpTfSvcInfra?.pr?.html_url
        }
      },
      githubAction: {
        name: cdpTfSvcInfra?.main?.workflow?.name,
        url: {
          text: removeHost(cdpTfSvcInfra?.main?.workflow?.html_url),
          href: cdpTfSvcInfra?.main?.workflow?.html_url
        },
        started: cdpTfSvcInfra?.main?.workflow?.created_at
      },
      errors: cdpTfSvcInfra?.result?.errors
        ?.map((error) => error?.message)
        .filter(Boolean)
    },
    cdpAppConfig: {
      name: 'Create App Config',
      url: {
        text: `${githubOrg}/cdp-app-config`,
        href: `https://github.com/${githubOrg}/cdp-app-config`
      },
      status: {
        text: cdpAppConfig?.status ?? unknownValue,
        classes: statusTagClassMap(cdpAppConfig?.status)
      },
      pullRequest: {
        url: {
          text: removeHost(cdpAppConfig?.pr?.html_url),
          href: cdpAppConfig?.pr?.html_url
        }
      },
      githubAction: {
        name: cdpAppConfig?.main?.workflow?.name,
        url: {
          text: removeHost(cdpAppConfig?.main?.workflow?.html_url),
          href: cdpAppConfig?.main?.workflow?.html_url
        },
        started: cdpAppConfig?.main?.workflow?.created_at
      },
      errors: cdpAppConfig?.result?.errors
        ?.map((error) => error?.message)
        .filter(Boolean)
    },
    cdpNginxUpstreams: {
      name: 'Create Nginx Upstreams',
      url: {
        text: `${githubOrg}/cdp-nginx-upstreams`,
        href: `https://github.com/${githubOrg}/cdp-nginx-upstreams`
      },
      status: {
        text: cdpNginxUpstreams?.status ?? unknownValue,
        classes: statusTagClassMap(cdpNginxUpstreams?.status)
      },
      pullRequest: {
        url: {
          text: removeHost(cdpNginxUpstreams?.pr?.html_url),
          href: cdpNginxUpstreams?.pr?.html_url
        }
      },
      githubAction: {
        name: cdpNginxUpstreams?.main?.workflow?.name,
        url: {
          text: removeHost(cdpNginxUpstreams?.main?.workflow?.html_url),
          href: cdpNginxUpstreams?.main?.workflow?.html_url
        },
        started: cdpNginxUpstreams?.main?.workflow?.created_at
      },
      errors: cdpNginxUpstreams?.result?.errors
        ?.map((error) => error?.message)
        .filter(Boolean)
    }
  }
}

export { transformStatus }
