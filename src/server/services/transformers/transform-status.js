import { startCase } from 'lodash'

import { config } from '~/src/config'
import { unknownValue } from '~/src/server/common/constants/no-value'
import { statusTagClassMap } from '~/src/server/services/transformers/status-tag-class-map'
import { removeUrlParts } from '~/src/server/common/helpers/remove-url-parts'
import { serviceCreationStatuses } from '~/src/server/common/constants/service-creation-statuses'
import { buildLink } from '~/src/server/common/helpers/build-link'

const githubOrg = config.get('githubOrg')

function transformStatus(service) {
  const serviceStatus = service.serviceStatus
  const createRepository = serviceStatus?.createRepository
  const cdpTfSvcInfra = serviceStatus?.['cdp-tf-svc-infra']
  const cdpAppConfig = serviceStatus?.['cdp-app-config']
  const cdpNginxUpstreams = serviceStatus?.['cdp-nginx-upstreams']

  const jobStatuses = [
    createRepository?.status,
    cdpTfSvcInfra?.status,
    cdpAppConfig?.status,
    cdpNginxUpstreams?.status
  ]
  const completeJobs = jobStatuses.filter(
    (status) => status === 'success'
  ).length

  return {
    started: serviceStatus?.started,
    hasJobFailures: [serviceStatus?.status, ...jobStatuses].some(
      (status) => status === 'failure'
    ),
    progress: {
      percentage: (100 / jobStatuses.length) * completeJobs,
      complete: completeJobs,
      total: jobStatuses.length
    },
    status: {
      value: serviceStatus.status,
      text: serviceStatus?.status
        ? startCase(serviceStatus.status)
        : unknownValue,
      classes: statusTagClassMap(serviceStatus?.status)
    },
    serviceType: serviceStatus.serviceType,
    createRepository: {
      name: 'Create Github Repository',
      part: 1,
      url: {
        text: removeUrlParts(service?.githubUrl),
        href: service?.githubUrl
      },
      status: {
        text: createRepository?.status
          ? startCase(createRepository?.status)
          : unknownValue,
        classes: statusTagClassMap(createRepository?.status)
      },
      info: () => {
        switch (createRepository?.status) {
          case serviceCreationStatuses.prOpen:
            return `Pull request has been raised and will shortly be automatically merged. The Github pull request link below has more information.`
          case serviceCreationStatuses.inProgress:
            return `Creating github repository from ${serviceStatus.serviceType} template. The Github action link below has more information.`
          case serviceCreationStatuses.created:
          case serviceCreationStatuses.success:
            return `Github repository created successfully, you can now checkout your new services code and start developing.`
          case serviceCreationStatuses.failure:
            return `Something has gone wrong, contact us using the details at the ${buildLink(
              '#app-help',
              'top of the page',
              false
            )}.`
        }
      }
    },
    cdpAppConfig: {
      name: 'Create Service Config',
      part: 2,
      url: {
        text: `${githubOrg}/cdp-app-config`,
        href: `https://github.com/${githubOrg}/cdp-app-config`
      },
      status: {
        text: cdpAppConfig?.status
          ? startCase(cdpAppConfig.status)
          : unknownValue,
        classes: statusTagClassMap(cdpAppConfig?.status)
      },
      info: () => {
        switch (cdpAppConfig?.status) {
          case serviceCreationStatuses.prOpen:
            return `Pull request has been raised and will shortly be automatically merged. The Github pull request link below has more information.`
          case serviceCreationStatuses.failure:
            return `Something has gone wrong, contact us using the details at the ${buildLink(
              '#app-help',
              'top of the page',
              false
            )}.`
          default:
            return `Services on the Core Delivery Platform are configured via environment variables. You can update your services config via pull request on the cdp-app-config
        repository. For more detailed information see the ${buildLink(
          `https://github.com/${githubOrg}/cdp-app-config`,
          'DEFRA/cdp-app-config/README.md'
        )}`
        }
      },
      pullRequest: {
        url: {
          text: removeUrlParts(cdpAppConfig?.pr?.html_url),
          href: cdpAppConfig?.pr?.html_url
        }
      },
      githubAction: {
        name: cdpAppConfig?.main?.workflow?.name,
        url: {
          text: removeUrlParts(cdpAppConfig?.main?.workflow?.html_url),
          href: cdpAppConfig?.main?.workflow?.html_url
        },
        started: cdpAppConfig?.main?.workflow?.created_at
      },
      errors:
        cdpAppConfig?.result?.errors
          ?.map((error) => error?.message)
          .filter(Boolean) ?? []
    },
    cdpNginxUpstreams: {
      name: 'Create Service networking',
      part: 3,
      url: {
        text: `${githubOrg}/cdp-nginx-upstreams`,
        href: `https://github.com/${githubOrg}/cdp-nginx-upstreams`
      },
      status: {
        text: cdpNginxUpstreams?.status
          ? startCase(cdpNginxUpstreams.status)
          : unknownValue,
        classes: statusTagClassMap(cdpNginxUpstreams?.status)
      },
      info: () => {
        switch (cdpNginxUpstreams?.status) {
          case serviceCreationStatuses.prOpen:
            return `Pull request has been raised and will shortly be automatically merged. The Github pull request link below has more information.`
          case serviceCreationStatuses.inProgress:
            return `Setting up your service to be accessible to other services/public on the Core Delivery Platform environments. The Github action link below has more information.`
          case serviceCreationStatuses.created:
          case serviceCreationStatuses.success:
            return `Your services path is now configured on the Core Delivery Platform environments.`
          case serviceCreationStatuses.failure:
            return `Something has gone wrong, contact us using the details at the ${buildLink(
              '#app-help',
              'top of the page',
              false
            )}.`
        }
      },
      pullRequest: {
        url: {
          text: removeUrlParts(cdpNginxUpstreams?.pr?.html_url),
          href: cdpNginxUpstreams?.pr?.html_url
        }
      },
      githubAction: {
        name: cdpNginxUpstreams?.main?.workflow?.name,
        url: {
          text: removeUrlParts(cdpNginxUpstreams?.main?.workflow?.html_url),
          href: cdpNginxUpstreams?.main?.workflow?.html_url
        },
        started: cdpNginxUpstreams?.main?.workflow?.created_at
      },
      errors:
        cdpNginxUpstreams?.result?.errors
          ?.map((error) => error?.message)
          .filter(Boolean) ?? []
    },
    cdpTfSvcInfra: {
      name: 'Create Service Infrastructure',
      part: 4,
      url: {
        text: `${githubOrg}/cdp-tf-svc-infra`,
        href: `https://github.com/${githubOrg}/cdp-tf-svc-infra`
      },
      status: {
        text: cdpTfSvcInfra?.status
          ? startCase(cdpTfSvcInfra.status)
          : unknownValue,
        classes: statusTagClassMap(cdpTfSvcInfra?.status)
      },
      info: () => {
        switch (cdpTfSvcInfra?.status) {
          case serviceCreationStatuses.prOpen:
            return `Pull request has been raised and will shortly be automatically merged. The Github pull request link below has more information.`
          case serviceCreationStatuses.inProgress:
            return `Setting up:
                      <ul class="govuk-list govuk-list--spaced">
                        <li>Elastic container registry</li>
                        <li>Database credentials</li>
                        <li>Permissions</li>
                      </ul>
                    You will need to wait for this stage to complete before you're able to deploy your service.
                    The Github action link below has more information.`
          case serviceCreationStatuses.created:
          case serviceCreationStatuses.success:
            return `All the supporting infrastructure for your service has been created.`
          case serviceCreationStatuses.failure:
            return `Something has gone wrong, contact us using the details at the ${buildLink(
              '#app-help',
              'top of the page',
              false
            )}.`
        }
      },
      pullRequest: {
        url: {
          text: removeUrlParts(cdpTfSvcInfra?.pr?.html_url),
          href: cdpTfSvcInfra?.pr?.html_url
        }
      },
      githubAction: {
        name: cdpTfSvcInfra?.main?.workflow?.name,
        url: {
          text: removeUrlParts(cdpTfSvcInfra?.main?.workflow?.html_url),
          href: cdpTfSvcInfra?.main?.workflow?.html_url
        },
        started: cdpTfSvcInfra?.main?.workflow?.created_at
      },
      errors:
        cdpTfSvcInfra?.result?.errors
          ?.map((error) => error?.message)
          .filter(Boolean) ?? []
    }
  }
}

export { transformStatus }
