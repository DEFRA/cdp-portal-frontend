import { omit, pickBy } from 'lodash'
import { getDeploymentStatusClassname } from '~/src/server/deployments/helpers/get-deployment-status-classname'

const byLatest = (a, b) => Date.parse(b.deployedAt) - Date.parse(a.deployedAt)

function calculateOverallStatus(ecsSvcDeployments) {
  const instanceStatuses = Object.entries(ecsSvcDeployments).reduce(
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

  const uniqueEcsSvcDeploymentIds = [
    ...new Set(
      deployments
        .map((deployment) => deployment?.ecsSvcDeploymentId)
        .filter(Boolean)
    )
  ]
  const ecsSvcDeployments = uniqueEcsSvcDeploymentIds.reduce(
    (deploymentsByEcsSvcId, id) => ({
      ...deploymentsByEcsSvcId,
      [id]: deployments
        .filter((deployment) => deployment?.ecsSvcDeploymentId === id)
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
    deployments: ecsSvcDeployments,
    status: calculateOverallStatus(ecsSvcDeployments)
  }
}

export { transformDeployment }
