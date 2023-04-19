import { config } from '~/src/config'
import { getDeploymentStatusClassname } from '~/src/app/deployments/helpers/get-deployment-status-classname'

function transformDeploymentsToEntities(deployment) {
  return [
    {
      kind: 'link',
      value: deployment.serviceName,
      url: `${config.get('appPathPrefix')}/deployments/${deployment.id}`,
      size: 'large'
    },
    {
      kind: 'text',
      value: deployment.version,
      size: 'small'
    },
    {
      kind: 'tag',
      value: deployment.targetEnvironment,
      classes: 'govuk-tag--blue',
      size: 'small'
    },
    {
      kind: 'tag',
      value: deployment.deploymentStatus,
      classes: getDeploymentStatusClassname(deployment.deploymentStatus),
      size: 'small'
    },
    {
      kind: 'text',
      value: deployment.triggeredByUserId,
      size: 'small'
    },
    {
      kind: 'date',
      value: deployment.timestamp,
      size: 'large'
    }
  ]
}

export { transformDeploymentsToEntities }
