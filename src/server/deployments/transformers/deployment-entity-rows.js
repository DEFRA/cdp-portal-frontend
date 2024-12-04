import { provideDeploymentStatusClassname } from '~/src/server/deployments/helpers/provide-deployment-status-classname.js'
import { sanitiseUser } from '~/src/server/common/helpers/sanitisation/sanitise-user.js'
import { augmentStatus } from '~/src/server/deployments/helpers/augment-status.js'
import { formatText } from '~/src/config/nunjucks/filters/index.js'

function deploymentEntityRows(deployments) {
  return deployments?.map(deploymentToEntityRow)
}

function deploymentToEntityRow(deployment) {
  const status = augmentStatus(deployment)
  const teams = deployment?.teams
    ?.filter((team) => team.teamId)
    ?.map((team) => ({
      kind: 'link',
      value: team.name,
      url: `/teams/${team.teamId}`
    }))

  return [
    {
      kind: 'link',
      value: deployment.service,
      url: `/deployments/${deployment.environment.toLowerCase()}/${
        deployment.cdpDeploymentId
      }`
    },
    {
      kind: 'group',
      value: teams?.length ? teams : null
    },
    {
      kind: 'link',
      value: deployment.version,
      url: `https://github.com/DEFRA/${deployment.service}/releases/tag/${deployment.version}`,
      newWindow: true
    },
    {
      kind: 'tag',
      value: formatText(status),
      classes: provideDeploymentStatusClassname(status)
    },
    {
      kind: 'text',
      value: sanitiseUser(deployment.user?.displayName)
    },
    {
      kind: 'date',
      value: deployment.created,
      withSeconds: true
    }
  ]
}

export { deploymentEntityRows }
