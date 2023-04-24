import { getDeploymentStatusClassname } from '~/src/app/deployments/helpers/get-deployment-status-classname'

function transformDeploymentToHeadingEntities(deployment) {
  return {
    primary: [
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
        value: deployment.version,
        size: 'small',
        label: 'Version'
      }
    ],
    secondary: [
      {
        kind: 'text',
        value: deployment.triggeredByUserId,
        size: 'small',
        label: 'Deployed by'
      },
      {
        kind: 'date',
        value: deployment.timestamp,
        size: 'large',
        label: 'On'
      }
    ]
  }
}

export { transformDeploymentToHeadingEntities }
