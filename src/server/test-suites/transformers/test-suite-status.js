import { config } from '~/src/config/config.js'
import { unknownValue } from '~/src/server/common/constants/no-value.js'
import { statusTagClassMap } from '~/src/server/common/helpers/status-tag-class-map.js'
import { removeUrlParts } from '~/src/server/common/helpers/remove-url-parts.js'
import { creationStatuses } from '~/src/server/common/constants/creation-statuses.js'
import { buildLink } from '~/src/server/common/helpers/build-link.js'

const githubOrg = config.get('githubOrg')

function testSuiteStatus(service) {
  const serviceStatus = service.serviceStatus
  const createRepository = serviceStatus?.['cdp-create-workflows']
  const cdpTfSvcInfra = serviceStatus?.['cdp-tf-svc-infra']
  const cdpSquidProxy = serviceStatus?.['cdp-squid-proxy']

  const jobStatuses = [
    createRepository?.status,
    cdpTfSvcInfra?.status,
    cdpSquidProxy?.status
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
      isSuccess: serviceStatus.status === creationStatuses.success,
      value: serviceStatus.status,
      text: serviceStatus?.status ? serviceStatus.status : unknownValue,
      classes: statusTagClassMap(serviceStatus?.status)
    },
    serviceTypeTemplate: serviceStatus.serviceTypeTemplate,
    createRepository: {
      name: 'GitHub Repository',
      part: 1,
      url:
        createRepository?.status === creationStatuses.success
          ? {
              text: `${serviceStatus.org}/${serviceStatus.repositoryName}`,
              href: `https://github.com/${serviceStatus.org}/${serviceStatus.repositoryName}`
            }
          : { text: '', href: '' },
      status: {
        text: createRepository?.status
          ? createRepository?.status
          : unknownValue,
        classes: statusTagClassMap(createRepository?.status)
      },
      info: () => {
        switch (createRepository?.status) {
          case creationStatuses.queued:
            return `GitHub repository creation queued.`
          case creationStatuses.raised:
          case creationStatuses.prOpen:
            return `Pull request has been raised and will shortly be automatically merged. The GitHub pull request link below has more information.`
          case creationStatuses.requested:
          case creationStatuses.inProgress:
            return `Creating new test suite GitHub repository from the ${service.serviceTypeTemplate} template.`
          case creationStatuses.created:
          case creationStatuses.success:
            return `Your new test suite GitHub repository has been successfully created, you can now checkout your code and start developing.`
          case creationStatuses.unknown:
          case creationStatuses.failure:
            return `Something has gone wrong, contact us using the details at the ${buildLink(
              '#app-help',
              'top of the page',
              false
            )}.`
          default:
            return 'Status unknown'
        }
      }
    },
    cdpSquidProxy: {
      name: 'Proxy',
      part: 2,
      url: {
        text: `${githubOrg}/cdp-squid-proxy`,
        href: `https://github.com/${githubOrg}/cdp-squid-proxy`
      },
      status: {
        text: cdpSquidProxy?.status ? cdpSquidProxy?.status : unknownValue,
        classes: statusTagClassMap(cdpSquidProxy?.status)
      },
      info: () => {
        switch (cdpSquidProxy?.status) {
          case creationStatuses.queued:
            return `Proxy config queued.`
          case creationStatuses.requested:
          case creationStatuses.inProgress:
            return `Setting up proxy access.`
          case creationStatuses.created:
          case creationStatuses.success:
            return `Your test suite can make outbound calls via the proxy.`
          case creationStatuses.unknown:
          case creationStatuses.failure:
            return `Something has gone wrong, contact us using the details at the ${buildLink(
              '#app-help',
              'top of the page',
              false
            )}.`
          default:
            return 'Status unknown'
        }
      },
      githubAction: {
        name: cdpSquidProxy?.main?.workflow?.name,
        url: {
          text: removeUrlParts(cdpSquidProxy?.main?.workflow?.html_url),
          href: cdpSquidProxy?.main?.workflow?.html_url
        },
        started: cdpSquidProxy?.main?.workflow?.created_at
      },
      errors:
        cdpSquidProxy?.result?.errors
          ?.map((error) => error?.message)
          .filter(Boolean) ?? []
    },
    cdpTfSvcInfra: {
      name: 'Infrastructure',
      part: 3,
      url: {
        text: `${githubOrg}/cdp-tf-svc-infra`,
        href: `https://github.com/${githubOrg}/cdp-tf-svc-infra`
      },
      status: {
        text: cdpTfSvcInfra?.status ? cdpTfSvcInfra.status : unknownValue,
        classes: statusTagClassMap(cdpTfSvcInfra?.status)
      },
      info: () => {
        switch (cdpTfSvcInfra?.status) {
          case creationStatuses.queued:
            return `Infrastructure creation queued.`
          case creationStatuses.requested:
          case creationStatuses.inProgress:
            return `Setting up:
                      <ul class="govuk-list govuk-list--bullet">
                        <li>Elastic container registry</li>
                        <li>Permissions</li>
                      </ul>
                    <p>
                      You will need to wait for this stage to complete before you're able to deploy your service.
                      The GitHub action link below has more information.
                    </p>`
          case creationStatuses.created:
          case creationStatuses.success:
            return `All the supporting infrastructure for your test suite has been created.`
          case creationStatuses.unknown:
          case creationStatuses.failure:
            return `Something has gone wrong, contact us using the details at the ${buildLink(
              '#app-help',
              'top of the page',
              false
            )}.`
          default:
            return 'Status unknown'
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

export { testSuiteStatus }
