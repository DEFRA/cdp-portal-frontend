import { config } from '~/src/config/config.js'
import { unknownValue } from '~/src/server/common/constants/no-value.js'
import { statusTagClassMap } from '~/src/server/common/helpers/status-tag-class-map.js'
import { removeUrlParts } from '~/src/server/common/helpers/remove-url-parts.js'
import { creationStatuses } from '~/src/server/common/constants/creation-statuses.js'
import { buildLink } from '~/src/server/common/helpers/view/build-link.js'

const githubOrg = config.get('githubOrg')

function serviceStatus(service) {
  const createStatusInfo = service.serviceStatus
  const createRepository = createStatusInfo?.['cdp-create-workflows']
  const cdpTfSvcInfra = createStatusInfo?.['cdp-tf-svc-infra']
  const cdpAppConfig = createStatusInfo?.['cdp-app-config']
  const cdpNginxUpstreams = createStatusInfo?.['cdp-nginx-upstreams']
  const cdpSquidProxy = createStatusInfo?.['cdp-squid-proxy']
  const cdpDashboard = createStatusInfo?.['cdp-grafana-svc']

  const jobStatuses = [
    createRepository?.status,
    cdpTfSvcInfra?.status,
    cdpAppConfig?.status,
    cdpNginxUpstreams?.status,
    cdpSquidProxy?.status,
    cdpDashboard?.status
  ]
  const completeJobs = jobStatuses.filter(
    (status) => status === 'success'
  ).length

  return {
    started: createStatusInfo?.started,
    hasJobFailures: [createStatusInfo?.status, ...jobStatuses].some(
      (status) => status === 'failure'
    ),
    progress: {
      percentage: (100 / jobStatuses.length) * completeJobs,
      complete: completeJobs,
      total: jobStatuses.length
    },
    status: {
      isSuccess: createStatusInfo.status === creationStatuses.success,
      value: createStatusInfo.status,
      text: createStatusInfo?.status ? createStatusInfo.status : unknownValue,
      classes: statusTagClassMap(createStatusInfo?.status)
    },
    serviceTypeTemplate: createStatusInfo.serviceTypeTemplate,
    createRepository: {
      name: 'GitHub Repository',
      part: 1,
      url:
        createRepository?.status === creationStatuses.success
          ? {
              text: `${createStatusInfo.org}/${createStatusInfo.repositoryName}`,
              href: `https://github.com/${createStatusInfo.org}/${createStatusInfo.repositoryName}`
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
          case creationStatuses.requested:
          case creationStatuses.inProgress:
            return `Creating new services GitHub repository from the ${createStatusInfo.serviceTypeTemplate} template.`
          case creationStatuses.created:
          case creationStatuses.success:
            return `Your new services GitHub repository has been successfully created, you can now checkout your code and start developing.`
          case creationStatuses.unknown:
          case creationStatuses.failure:
            return `Something has gone wrong, contact us using the details at the ${buildLink(
              { href: '#app-help', text: 'top of the page', newTab: false }
            )}.`
          default:
            return 'Status unknown'
        }
      }
    },
    cdpAppConfig: {
      name: 'Config',
      part: 2,
      url: {
        text: `${githubOrg}/cdp-app-config`,
        href: `https://github.com/${githubOrg}/cdp-app-config`
      },
      status: {
        text: cdpAppConfig?.status ? cdpAppConfig.status : unknownValue,
        classes: statusTagClassMap(cdpAppConfig?.status)
      },
      info: () => {
        switch (cdpAppConfig?.status) {
          case creationStatuses.queued:
            return `Config creation queued.`
          case creationStatuses.requested:
          case creationStatuses.inProgress:
            return `Config creation in progress.`
          case creationStatuses.unknown:
          case creationStatuses.failure:
            return `Something has gone wrong, contact us using the details at the ${buildLink(
              { href: '#app-help', text: 'top of the page', newTab: false }
            )}.`
          default:
            return `Services on the Core Delivery Platform are configured via environment variables. You can update your services config via pull request on the cdp-app-config
        repository. For more detailed information see the ${buildLink({
          href: `https://github.com/${githubOrg}/cdp-app-config`,
          text: 'DEFRA/cdp-app-config/README.md'
        })}`
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
      name: 'Networking',
      part: 3,
      url: {
        text: `${githubOrg}/cdp-nginx-upstreams`,
        href: `https://github.com/${githubOrg}/cdp-nginx-upstreams`
      },
      status: {
        text: cdpNginxUpstreams?.status
          ? cdpNginxUpstreams.status
          : unknownValue,
        classes: statusTagClassMap(cdpNginxUpstreams?.status)
      },
      info: () => {
        switch (cdpNginxUpstreams?.status) {
          case creationStatuses.queued:
            return `Network setup queued.`
          case creationStatuses.requested:
          case creationStatuses.inProgress:
            return `Setting up your service to be accessible to other services/public on the Core Delivery Platform environments. The GitHub action link below has more information.`
          case creationStatuses.created:
          case creationStatuses.success:
            return `Your new services path is now configured on the Core Delivery Platform environments.`
          case creationStatuses.unknown:
          case creationStatuses.failure:
            return `Something has gone wrong, contact us using the details at the ${buildLink(
              { href: '#app-help', text: 'top of the page', newTab: false }
            )}.`
          default:
            return 'Status unknown'
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
    cdpSquidProxy: {
      name: 'Proxy',
      part: 4,
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
            return 'Proxy config queued.'
          case creationStatuses.requested:
          case creationStatuses.inProgress:
            return `Setting up proxy access.`
          case creationStatuses.created:
          case creationStatuses.success:
            return `Your new service can now make outbound calls via the proxy.`
          case creationStatuses.unknown:
          case creationStatuses.failure:
            return `Something has gone wrong, contact us using the details at the ${buildLink(
              { href: '#app-help', text: 'top of the page', newTab: false }
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
    cdpDashboard: {
      name: 'Dashboards',
      part: 5,
      url: {
        text: `${githubOrg}/cdp-grafana-svc`,
        href: `https://github.com/${githubOrg}/cdp-grafana-svc`
      },
      status: {
        text: cdpDashboard?.status ? cdpDashboard?.status : unknownValue,
        classes: statusTagClassMap(cdpDashboard?.status)
      },
      info: () => {
        switch (cdpDashboard?.status) {
          case creationStatuses.queued:
            return 'Dashboard creation queued.'
          case creationStatuses.requested:
          case creationStatuses.inProgress:
            return `Setting up Grafana dashboards for your service.`
          case creationStatuses.created:
          case creationStatuses.success:
            return `Default Grafana observability metrics data and graph dashboards created for your service.`
          case creationStatuses.unknown:
          case creationStatuses.failure:
            return `Something has gone wrong, contact us using the details at the ${buildLink(
              { href: '#app-help', text: 'top of the page', newTab: false }
            )}.`
          default:
            return 'Status unknown'
        }
      },
      githubAction: {
        name: cdpDashboard?.main?.workflow?.name,
        url: {
          text: removeUrlParts(cdpDashboard?.main?.workflow?.html_url),
          href: cdpDashboard?.main?.workflow?.html_url
        },
        started: cdpDashboard?.main?.workflow?.created_at
      },
      errors:
        cdpDashboard?.result?.errors
          ?.map((error) => error?.message)
          .filter(Boolean) ?? []
    },
    cdpTfSvcInfra: {
      name: 'Infrastructure',
      part: 6,
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
          case creationStatuses.requested:
          case creationStatuses.queued:
            return `Infrastructure changes have been queued as there are other infrastructure changes in progress that must complete first.
                    <p>
                      You will need to wait for this stage to complete before you're able to deploy your service.
                      The GitHub action link below has more information.
                    </p>`
          case creationStatuses.inProgress:
            return `Setting up:
                      <ul class="govuk-list govuk-list--bullet">
                        <li>Elastic container registry</li>
                        <li>Database credentials</li>
                        <li>Permissions</li>
                      </ul>
                    <p>
                      You will need to wait for this stage to complete before you're able to deploy your service.
                      The GitHub action link below has more information.
                    </p>`
          case creationStatuses.created:
          case creationStatuses.success:
            return `All the supporting infrastructure for your service has been created.`
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

export { serviceStatus }
