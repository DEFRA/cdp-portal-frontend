import { formatText } from '~/src/config/nunjucks/filters/filters.js'
import { augmentStatus } from '~/src/server/deployments/helpers/augment-status.js'
import { sanitiseUser } from '~/src/server/common/helpers/sanitisation/sanitise-user.js'
import { provideDeploymentStatusClassname } from '~/src/server/deployments/helpers/provide-deployment-status-classname.js'
import {
  renderComponent,
  renderIcon
} from '~/src/server/common/helpers/nunjucks/render-component.js'

function buildDescription(deployment) {
  const tooltipText = `Service Deployment: ${deployment.version} - ${formatText(deployment.status)}`

  return `<a class="app-link app-entity-table__row-header" href="/deployments/${deployment.environment.toLowerCase()}/${deployment.cdpDeploymentId}" data-testid="app-link">${deployment.service}</a>
          <div class="app-!-layout-centered govuk-!-margin-top-1">
            ${renderComponent('tool-tip', { text: tooltipText }, [
              renderIcon('instance-icon', {
                classes: 'app-icon--small govuk-!-margin-right-1'
              })
            ])}
            <div class="app-entity-table__row-caption">Microservice deployment</div>
          </div>`
}

function deploymentToEntityRow(isAuthenticated) {
  return (deployment) => {
    const status = augmentStatus(deployment)
    const teams = deployment?.teams
      ?.filter((team) => team.teamId)
      ?.map((team) => ({
        kind: 'link',
        value: team.name,
        url: `/teams/${team.teamId}`
      }))

    const icon = deployment.isOwner
      ? renderComponent(
          'tool-tip',
          {
            text: 'Owned Service',
            classes: 'app-tool-tip--small'
          },
          [renderIcon('star-icon', { classes: 'app-icon--tiny' })]
        )
      : ''

    return {
      cells: [
        ...(isAuthenticated
          ? [
              {
                headers: 'owner',
                isCentered: true,
                classes: 'app-entity-table__cell--owned',
                entity: { kind: 'html', value: icon }
              }
            ]
          : []),
        {
          headers: 'description',
          html: buildDescription(deployment)
        },
        {
          headers: 'version',
          entity: {
            kind: 'link',
            value: deployment.version,
            url: `https://github.com/DEFRA/${deployment.service}/releases/tag/${deployment.version}`,
            newWindow: true
          }
        },
        {
          headers: 'status',
          entity: {
            kind: 'tag',
            value: formatText(status),
            classes: provideDeploymentStatusClassname(status)
          }
        },
        {
          headers: 'kind',
          entity: {
            kind: 'tag',
            value: 'Deployment',
            classes: 'govuk-tag--blue'
          }
        },
        {
          headers: 'by',
          entity: {
            kind: 'text',
            value: sanitiseUser(deployment.user?.displayName)
          }
        },
        {
          headers: 'team',
          entity: {
            kind: 'group',
            value: teams?.length ? teams : null
          }
        },
        {
          headers: 'started',
          entity: {
            kind: 'date',
            value: deployment.created,
            withSeconds: true
          }
        }
      ]
    }
  }
}

export { deploymentToEntityRow }
