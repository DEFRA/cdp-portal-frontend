import { omit, pickBy } from 'lodash'

import { provideEventStatus } from '~/src/server/deployments/helpers/provide-event-status'
import { deploymentStatus } from '~/src/server/deployments/constants/deployment-status'
import { calculateDeploymentStatus } from '~/src/server/deployments/helpers/calculate-deployment-status'

const byLatest = (a, b) => Date.parse(b.deployedAt) - Date.parse(a.deployedAt)

function transformDeployment(deploymentEvents) {
  const requestedDeployment = deploymentEvents.find(
    (deploymentEvent) =>
      deploymentEvent.status.toLowerCase() === deploymentStatus.requested
  )

  const deploymentTasks = deploymentEvents.filter(
    (event) =>
      event.ecsSvcDeploymentId === requestedDeployment.ecsSvcDeploymentId &&
      event.status.toLowerCase() !== deploymentStatus.requested
  )

  if (requestedDeployment && deploymentTasks.length === 0) {
    return {
      ...omit(pickBy(requestedDeployment), [
        'status',
        'taskId',
        'ecsSvcDeploymentId',
        'instanceTaskId'
      ]),
      status: provideEventStatus(requestedDeployment),
      tasks: []
    }
  }

  if (requestedDeployment && deploymentTasks.length > 0) {
    const deploymentTaskIds = [
      ...new Set(
        deploymentTasks
          .sort(byLatest)
          .map((event) => event.instanceTaskId)
          .filter(Boolean)
      )
    ]
    const eventsByTaskId = deploymentTaskIds.reduce(
      (taskEvents, taskId) => ({
        ...taskEvents,
        [taskId]: deploymentTasks
          .filter((event) => event.instanceTaskId === taskId)
          .map((event) => ({ ...event, status: provideEventStatus(event) }))
          .sort(byLatest)
          .at(0)
      }),
      {}
    )

    const latestTasks = Object.values(eventsByTaskId)
      .sort(byLatest)
      .map((event) => event)
    const latestTask = latestTasks.at(0)

    return {
      ...omit(pickBy(latestTask), [
        'status',
        'taskId',
        'ecsSvcDeploymentId',
        'instanceTaskId'
      ]),
      status: calculateDeploymentStatus(latestTasks),
      tasks: eventsByTaskId
    }
  }
}

export { transformDeployment }
