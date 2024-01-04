import { omit, pickBy } from 'lodash'
import { getDeploymentStatusClassname } from '~/src/server/deployments/helpers/get-deployment-status-classname'

const byLatest = (a, b) => Date.parse(b.deployedAt) - Date.parse(a.deployedAt)

function calculateOverallStatus(instanceDeployments) {
  const instanceStatuses = Object.entries(instanceDeployments).reduce(
    (statuses, [key, value]) => ({
      ...statuses,
      [key]: value?.at(0)?.status.text
    }),
    {}
  )

  const allRunning = Object.values(instanceStatuses).every(
    (status) => status === 'RUNNING'
  )
  const allFailed = Object.values(instanceStatuses).every(
    (status) => status === 'FAILED'
  )
  const statusText = allRunning ? 'RUNNING' : allFailed ? 'FAILED' : 'PENDING'

  return {
    text: statusText,
    classes: getDeploymentStatusClassname(statusText)
  }
}

function transformDeployment(deployments) {
  const latestDeployment = deployments.sort(byLatest)?.at(0)

  const uniqueInstanceTaskIds = [
    ...new Set(
      deployments
        .map((deployment) => deployment?.instanceTaskId)
        .filter(Boolean)
    )
  ]
  const instanceDeployments = uniqueInstanceTaskIds.reduce(
    (deploymentsByEcsSvcId, id) => ({
      ...deploymentsByEcsSvcId,
      [id]: deployments
        .filter((deployment) => deployment?.instanceTaskId === id)
        .map((deployment) => ({
          ...deployment,
          status: {
            text: deployment.status,
            classes: getDeploymentStatusClassname(deployment.status)
          }
        }))
        .sort(byLatest)
    }),
    {}
  )

  return {
    ...omit(pickBy(latestDeployment), [
      'status',
      'taskId',
      'ecsSvcDeploymentId',
      'instanceTaskId'
    ]),
    deployments: instanceDeployments,
    status: calculateOverallStatus(instanceDeployments)
  }
}

export { transformDeployment }
