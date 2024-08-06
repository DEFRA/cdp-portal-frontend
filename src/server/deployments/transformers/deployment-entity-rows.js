import { kebabCase, upperFirst } from 'lodash'

import { provideDeploymentStatusClassname } from '~/src/server/deployments/helpers/provide-deployment-status-classname'
import { sanitiseUser } from '~/src/server/common/helpers/sanitisation/sanitise-user'
import { augmentStatus } from '~/src/server/deployments/helpers/augment-status'

function deploymentEntityRows(deployments) {
  return deployments?.map(deploymentToEntityRow)
}

function deploymentToEntityRow(deployment) {
  const status = augmentStatus(deployment)

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
      value: deployment?.teams?.map((team) => ({
        kind: 'link',
        value: team.name,
        url: `/teams/${team.teamId}`
      }))
    },
    {
      kind: 'link',
      value: deployment.version,
      url: `https://github.com/DEFRA/${deployment.service}/releases/tag/${deployment.version}`,
      newWindow: true
    },
    {
      kind: 'tag',
      value: upperFirst(kebabCase(status)),
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
