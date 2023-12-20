import { omit, pickBy } from 'lodash'

const byLatest = (a, b) => Date.parse(b.deployedAt) - Date.parse(a.deployedAt)

function calculateOverallStatus(ecsSvcDeployments) {
  const instanceStatuses = Object.entries(ecsSvcDeployments).reduce(
    (statuses, [key, value]) => ({
      ...statuses,
      [key]: value?.at(0)?.status
    }),
    {}
  )

  return {
    overall: Object.values(instanceStatuses).every(
      (status) => status === 'RUNNING'
    )
      ? 'RUNNING'
      : 'PENDING',
    instances: instanceStatuses
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
