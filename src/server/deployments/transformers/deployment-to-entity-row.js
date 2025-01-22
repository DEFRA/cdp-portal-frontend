import { provideDeploymentStatusClassname } from '~/src/server/deployments/helpers/provide-deployment-status-classname.js'
import { sanitiseUser } from '~/src/server/common/helpers/sanitisation/sanitise-user.js'
import { augmentStatus } from '~/src/server/deployments/helpers/augment-status.js'
import { formatText } from '~/src/config/nunjucks/filters/index.js'
import {
  renderComponent,
  renderIcon
} from '~/src/server/common/helpers/nunjucks/render-component.js'

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
          { text: 'Owned Service', classes: 'app-tool-tip--small' },
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
          headers: 'deployment',
          entity: {
            kind: 'link',
            value: deployment.service,
            url: `/deployments/${deployment.environment.toLowerCase()}/${
              deployment.cdpDeploymentId
            }`
          }
        },
        {
          headers: 'service-status',
          entity: {
            kind: 'tag',
            value: formatText(status),
            classes: provideDeploymentStatusClassname(status)
          }
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
          headers: 'service-status',
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
          headers: 'deployment-started',
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
