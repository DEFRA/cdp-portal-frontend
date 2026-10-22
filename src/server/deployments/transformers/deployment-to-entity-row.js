import { formatText } from '#config/nunjucks/filters/filters.js'
import { augmentStatus } from '../helpers/augment-status.js'
import { sanitiseUser } from '../../common/helpers/sanitisation/sanitise-user.js'
import { provideDeploymentStatusClassname } from '../helpers/provide-deployment-status-classname.js'
import { formatChangeRecord } from '#server/deployments/helpers/format-change-record.js'

function deploymentToEntityRow(deployment) {
  const status = augmentStatus(deployment)
  const changeRequest = formatChangeRecord(deployment)
  return {
    isOwner: deployment.isOwner,
    service: deployment.service,
    version: deployment.version,
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
