import { config } from '~/src/config'
import { getDeploymentStatusClassname } from '~/src/app/deployments/helpers/get-deployment-status-classname'

function transformDeploymentToEntityRow(deployment) {
  return [
    {
      kind: 'link',
      value: deployment.serviceName,
      url: `${config.get('appPathPrefix')}/deployments/${deployment.id}`
    },
    {
      kind: 'tag',
      value: deployment.targetEnvironment,
      classes: 'govuk-tag--blue'
    },
    {
      kind: 'text',
      value: deployment.version
    },
    {
      kind: 'tag',
      value: deployment.deploymentStatus,
      classes: getDeploymentStatusClassname(deployment.deploymentStatus)
    },
    {
      kind: 'text',
      value: deployment.triggeredByUserId
    },
    {
      kind: 'date',
      value: deployment.timestamp
    }
  ]
}

export { transformDeploymentToEntityRow }
