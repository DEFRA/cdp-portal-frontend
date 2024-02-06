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
      status: provideEventStatus(requestedDeployment)
    }
  }

  if (requestedDeployment && deploymentTasks.length > 0) {
    const taskIds = [
      ...new Set(
        deploymentTasks
          .sort(byLatest)
          .map((event) => {
            if (event.instanceTaskId) {
              return event.instanceTaskId.split('/').at(0)
            }
            return null
          })
          .filter(Boolean)
      )
    ]

    const eventsByTaskId = taskIds.reduce((events, taskId) => {
      const instancesGroupedByTaskDefinition = deploymentTasks
        .filter((task) => task.instanceTaskId.startsWith(taskId))
        .reduce((taskInstanceEvents, taskEvent) => {
          const instanceId = taskEvent.instanceTaskId.split('/').at(-1)
          const taskWithStatus = {
            ...taskEvent,
            status: provideEventStatus(taskEvent)
          }

          if (Array.isArray(taskInstanceEvents[instanceId])) {
            taskInstanceEvents[instanceId].push(taskWithStatus)
          } else {
            taskInstanceEvents[instanceId] = [taskWithStatus]
          }

          return taskInstanceEvents
        }, {})

      const latestTaskInstances = Object.entries(
        instancesGroupedByTaskDefinition
      )
        .map(([, instanceDeployments]) =>
          instanceDeployments.sort(byLatest).at(0)
        )
        .sort(byLatest)
        .slice(0, requestedDeployment.instanceCount)

      return {
        ...events,
        [taskId]: latestTaskInstances
      }
    }, {})

    const latestInstanceDeployments = Object.entries(eventsByTaskId).flatMap(
      ([, instanceDeployments]) => instanceDeployments
    )

    return {
      ...omit(pickBy(latestInstanceDeployments.at(0)), [
        'status',
        'taskId',
        'ecsSvcDeploymentId',
        'instanceTaskId'
      ]),
      status: calculateDeploymentStatus(latestInstanceDeployments),
      events: eventsByTaskId
    }
  }
}

export { transformDeployment }
