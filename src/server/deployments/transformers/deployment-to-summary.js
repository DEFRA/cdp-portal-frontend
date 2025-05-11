import { buildLink } from '~/src/server/common/helpers/view/build-link.js'
import { noValue } from '~/src/server/common/constants/no-value.js'
import { provideDeploymentStatusClassname } from '~/src/server/deployments/helpers/provide-deployment-status-classname.js'
import { buildList } from '~/src/server/common/helpers/view/build-list.js'
import {
  formatText,
  pluralise,
  sanitiseUser
} from '~/src/config/nunjucks/filters/filters.js'
import {
  renderComponent,
  renderIcon
} from '~/src/server/common/helpers/nunjucks/render-component.js'

const instanceIcon = renderIcon('instance-icon', {
  description: 'Instance',
  classes: 'app-icon--small govuk-!-margin-right-1'
})
const instanceSuccessIcon = renderIcon('instance-success-icon', {
  description: 'Instance running',
  classes: 'app-icon--small govuk-!-margin-right-1'
})
const instanceFailedIcon = renderIcon('instance-failed-icon', {
  description: 'Instance failed to start',
  classes: 'app-icon--small govuk-!-margin-right-1'
})
const instanceStoppedIcon = renderIcon('instance-stopped-icon', {
  description: 'Instance stopped',
  classes: 'app-icon--small govuk-!-margin-right-1'
})
const instancePendingIcon = renderIcon('instance-pending-icon', {
  description: 'Instance pending',
  classes: 'app-icon--small govuk-!-margin-right-1'
})

function getIcon(status, unstable) {
  if (status === 'running') {
    return instanceSuccessIcon
  } else if (status === 'stopped' && unstable === true) {
    return instanceFailedIcon
  } else if (status === 'stopped') {
    return instanceStoppedIcon
  } else if (
    status === 'pending' ||
    status === 'stopping' ||
    status === 'deploying'
  ) {
    return instancePendingIcon
  } else {
    return instanceIcon
  }
}

function buildInstanceStatus(deployment) {
  const deploymentInstances = Object.values(deployment.instances)
  const waitingMessage = 'Deployment requested, information coming soon'

  if (deploymentInstances.length === 0) {
    return waitingMessage
  }

  return deploymentInstances.reduce((htmlString, instance) => {
    const tooltipText = deployment.unstable
      ? 'Failed'
      : formatText(instance.status)
    const icon = getIcon(instance.status)

    return (
      htmlString +
      `${renderComponent('tool-tip', { text: tooltipText }, [icon])}`
    )
  }, '')
}

function transformDeploymentToSummary(deployment) {
  const teams = deployment?.teams
    ?.filter((team) => team.teamId)
    ?.map((team) => buildLink(`/teams/${team.teamId}`, team.name, false))

  const topics = deployment?.topics?.map((topic) =>
    renderComponent('tag', {
      text: topic,
      url: `https://github.com/search?q=topic%3Acdp+org%3ADEFRA+topic%3A${topic}&type=repositories`,
      newWindow: true,
      link: { classes: 'app-link--without-underline' },
      attributes: { 'data-testid': 'govuk-tag' }
    }).trim()
  )

  const serviceLinkText = deployment.isFrontend
    ? 'Application link'
    : 'API root url'

  return {
    classes: 'app-summary-list govuk-!-margin-bottom-0',
    attributes: {
      'data-testid': 'govuk-summary-list'
    },
    rows: [
      {
        key: { text: 'Microservice name' },
        value: {
          html: buildLink(
            `/services/${deployment.service}`,
            deployment.service,
            false
          )
        }
      },
      {
        key: { text: 'Environment' },
        value: { text: deployment.environment ?? noValue }
      },
      {
        key: { text: 'Version' },
        value: {
          html: deployment.version
            ? buildLink(
                `https://github.com/DEFRA/${deployment.service}/releases/tag/${deployment.version}`,
                deployment.version
              )
            : noValue
        }
      },
      {
        key: { text: 'Kind' },
        value: {
          html: `<div class="app-!-layout-centered">
                  ${renderIcon('instance-icon', {
                    classes: 'app-icon--small govuk-!-margin-right-1'
                  })}
                  ${renderComponent('tag', {
                    text: 'Deployment'
                  })}
                </div>`
        }
      },
      {
        key: { text: 'Instance count' },
        value: { text: deployment.instanceCount ?? noValue }
      },
      {
        key: { text: 'CPU' },
        value: {
          text: deployment.cpu ? `${deployment.cpu / 1024} vCPU` : noValue
        }
      },
      {
        key: { text: 'Memory' },
        value: {
          text: deployment.memory ? `${deployment.memory / 1024} GB` : noValue
        }
      },
      {
        key: { text: serviceLinkText },
        value: {
          html: buildLink(
            `https://${deployment.service}.${deployment.environment}.cdp-int.defra.cloud`
          )
        }
      },
      {
        key: { text: 'Topics' },
        value: {
          html: topics?.length ? topics.join(' ') : noValue
        }
      },
      {
        key: { text: 'Deployed by' },
        value: {
          text: sanitiseUser(deployment.user?.displayName)
        }
      },
      {
        key: { text: pluralise('Team', teams?.length) },
        value: {
          html: teams?.length ? buildList(teams) : noValue
        }
      }
    ]
  }
}

function transformDeploymentToStatusSummary(deployment, ecsDeployment) {
  return {
    classes: 'app-summary-list govuk-!-margin-bottom-0',
    attributes: {
      'data-testid': 'govuk-summary-list'
    },
    rows: [
      {
        key: {
          text: 'Status'
        },
        value: {
          html: renderComponent('tag', {
            text: formatText(deployment.status),
            classes: provideDeploymentStatusClassname(deployment.status)
          })
        }
      },
      {
        key: { text: 'Instance status' },
        value: {
          html: buildInstanceStatus(deployment)
        }
      },
      {
        key: { text: 'Deployment information' },
        value: {
          text: ecsDeployment.message ?? noValue
        }
      },
      {
        key: { text: 'Application logs' },
        value: {
          html: renderComponent('logs-dashboard-link', {
            serviceName: deployment.service,
            environment: deployment.environment
          })
        }
      },
      {
        key: { text: 'Started' },
        value: {
          html: renderComponent('time', { datetime: deployment.created })
        }
      },
      {
        key: { text: 'Updated' },
        value: {
          html: renderComponent('time', { datetime: deployment.updated })
        }
      }
    ]
  }
}

export { transformDeploymentToSummary, transformDeploymentToStatusSummary }
