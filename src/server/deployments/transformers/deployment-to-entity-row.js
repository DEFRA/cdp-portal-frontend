import { formatText } from '#config/nunjucks/filters/filters.js'
import { augmentStatus } from '../helpers/augment-status.js'
import { sanitiseUser } from '../../common/helpers/sanitisation/sanitise-user.js'
import { provideDeploymentStatusClassname } from '../helpers/provide-deployment-status-classname.js'
import { formatChangeRecord } from '#server/deployments/helpers/format-change-record.js'
import { buildLink } from '#server/common/helpers/view/build-link.js'
import { getIcon } from '#server/deployments/transformers/deployment-to-summary.js'

function deploymentToEntityRow(deployment) {
  const status = augmentStatus(deployment)
  const changeRequest = formatChangeRecord(deployment)

  const icon = getIcon(status)
  const versionRow = {
    html: `
            <div style="display: flex; align-items: center; justify-content: flex-start;">
              ${icon} ${buildLink({ href: `/deployments/${deployment.environment}/${deployment.cdpDeploymentId}`, text: deployment.version })}
            </div>
          `
  }
  return {
    isOwner: deployment.isOwner,
    service: deployment.service,
    version: deployment.version,
    versionRow,
    environment: deployment.environment,
    deploymentId: deployment.cdpDeploymentId,
    kind: 'deployment',
    kindText: 'Deployment',
    kindClass: 'govuk-tag--blue',
    statusText: formatText(status),
    statusClass: provideDeploymentStatusClassname(status),
    changeRecordText: changeRequest.text,
    changeRecordClass: changeRequest.class,
    teams: deployment.teams,
    by: sanitiseUser(deployment.user?.displayName),
    started: deployment.created
  }
}

export { deploymentToEntityRow }
