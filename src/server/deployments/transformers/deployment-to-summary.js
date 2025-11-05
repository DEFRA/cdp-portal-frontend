import { buildLink } from '../../common/helpers/view/build-link.js'
import { noValue } from '../../common/constants/no-value.js'
import { provideDeploymentStatusClassname } from '../helpers/provide-deployment-status-classname.js'
import { buildList } from '../../common/helpers/view/build-list.js'
import {
  formatText,
  pluralise,
  sanitiseUser
} from '../../../config/nunjucks/filters/filters.js'
import {
  renderComponent,
  renderIcon
} from '../../common/helpers/nunjucks/render-component.js'
import { renderTag } from '../../common/helpers/view/render-tag.js'

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
  const deploymentType =
    deployment.instanceCount === 0 ? 'Undeployment' : 'Deployment'
  const waitingMessage = `${deploymentType} requested, information coming soon`

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
    ?.map((team) =>
      buildLink({
        href: `/teams/${team.teamId}`,
        text: team.name,
        newTab: false
      })
    )

  const topics = deployment?.topics?.map((topic) =>
    renderTag({
      text: topic,
      url: `https://github.com/search?q=topic%3Acdp+org%3ADEFRA+topic%3A${topic}&type=repositories`,
      newWindow: true,
      link: { classes: 'app-link--without-underline' },
      attributes: { 'data-testid': 'govuk-tag' }
    })
  )

  return {
    classes: 'app-summary-list govuk-!-margin-bottom-0',
    attributes: {
      'data-testid': 'govuk-summary-list'
    },
    rows: [
      {
        key: { text: 'Microservice name' },
        value: {
          html: buildLink({
            href: `/services/${deployment.service}`,
            text: deployment.service,
            newTab: false
          })
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
            ? buildLink({
                href: `https://github.com/DEFRA/${deployment.service}/releases/tag/${deployment.version}`,
                text: deployment.version
              })
            : noValue
        }
      },
      {
        key: { text: 'Kind' },
        value: {
          html: `<div class="app-!-layout-centered">
                  ${renderIcon('instance-icon', { classes: 'app-icon--small govuk-!-margin-right-1' })}
                  ${renderTag({ text: 'Deployment' })}
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
        key: { text: 'Url' },
        value: {
          html: buildLink({
            href: `https://${deployment.service}.${deployment.environment}.cdp-int.defra.cloud`
          })
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
          html: teams?.length ? buildList({ items: teams }) : noValue
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
          html: renderTag({
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
          html: buildLink({
            href: `https://logs.${encodeURI(deployment.environment)}.cdp-int.defra.cloud/_dashboards/app/dashboards#/view/${encodeURI(deployment.service)}`,
            text: `https://logs.${encodeURI(deployment.environment)}.cdp-int.defra.cloud/`
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
