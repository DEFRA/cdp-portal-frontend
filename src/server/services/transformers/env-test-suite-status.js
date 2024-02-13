import { startCase } from 'lodash'

import { config } from '~/src/config'
import { unknownValue } from '~/src/server/common/constants/no-value'
import { statusTagClassMap } from '~/src/server/services/helpers/status-tag-class-map'
import { removeUrlParts } from '~/src/server/common/helpers/remove-url-parts'
import { creationStatuses } from '~/src/server/common/constants/creation-statuses'
import { buildLink } from '~/src/server/common/helpers/build-link'

const githubOrg = config.get('githubOrg')

function envTestSuiteStatus(service) {
  const serviceStatus = service.serviceStatus
  const createRepository = serviceStatus?.createRepository
  const cdpTfSvcInfra = serviceStatus?.['cdp-tf-svc-infra']

  const jobStatuses = [createRepository?.status, cdpTfSvcInfra?.status]
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
      text: serviceStatus?.status
        ? startCase(serviceStatus.status)
        : unknownValue,
      classes: statusTagClassMap(serviceStatus?.status)
    },
    serviceTypeTemplate: service.serviceTypeTemplate,
    createRepository: {
      name: 'Github Repository',
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
          case creationStatuses.raised:
          case creationStatuses.prOpen:
            return `Pull request has been raised and will shortly be automatically merged. The Github pull request link below has more information.`
          case creationStatuses.requested:
          case creationStatuses.inProgress:
            return `Creating new environment test suite Github repository from the ${service.serviceTypeTemplate} template.`
          case creationStatuses.created:
          case creationStatuses.success:
            return `Your new environment test suite Github repository has been successfully created, you can now checkout your code and start developing.`
          case creationStatuses.unknown:
          case creationStatuses.failure:
            return `Something has gone wrong, contact us using the details at the ${buildLink(
              '#app-help',
              'top of the page',
              false
            )}.`
        }
      }
    },
    cdpTfSvcInfra: {
      name: 'Infrastructure',
      part: 2,
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
          case creationStatuses.raised:
          case creationStatuses.prOpen:
            return `Pull request has been raised and will shortly be automatically merged. The Github pull request link below has more information.`
          case creationStatuses.requested:
          case creationStatuses.inProgress:
            return `Setting up:
                      <ul class="govuk-list govuk-list--bullet">
                        <li>Elastic container registry</li>
                        <li>Permissions</li>
                      </ul>
                    <p>
                      You will need to wait for this stage to complete before you're able to deploy your service.
                      The Github action link below has more information.
                    </p>`
          case creationStatuses.created:
          case creationStatuses.success:
            return `All the supporting infrastructure for your environment test suite has been created.`
          case creationStatuses.unknown:
          case creationStatuses.failure:
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

export { envTestSuiteStatus }
