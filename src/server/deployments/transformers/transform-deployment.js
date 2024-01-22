import { omit, pickBy } from 'lodash'

import { provideDeploymentStatusClassname } from '~/src/server/deployments/helpers/provide-deployment-status-classname'
import { deploymentStatus } from '~/src/server/deployments/constants/deployment-status'
import { provideStatusText } from '~/src/server/deployments/helpers/provide-status-text'

const byLatest = (a, b) => Date.parse(b.deployedAt) - Date.parse(a.deployedAt)

function getDeploymentStatusText(tasks) {
  const allRunning =
    tasks.length &&
    tasks.every((task) => task.status.text === deploymentStatus.deployed)
  const anyFailed =
    tasks.length &&
    tasks.some((task) => task.status.text === deploymentStatus.failed)
  const allStopped =
    tasks.length &&
    tasks.every((task) => task.status.text === deploymentStatus.stopped)

  switch (true) {
    case allRunning:
      return deploymentStatus.deployed
    case anyFailed:
      return deploymentStatus.failed
    case allStopped:
      return deploymentStatus.stopped
    default:
      return deploymentStatus.pending
  }
}

function calculateDeploymentStatus(tasks) {
  const statusText = getDeploymentStatusText(tasks)

  return {
    text: statusText,
    hasFinished: statusText === deploymentStatus.deployed,
    classes: provideDeploymentStatusClassname(statusText)
  }
}

function provideStatus(value) {
  const status = value.toLowerCase()

  return {
    text: provideStatusText(status),
    classes: provideDeploymentStatusClassname(status),
    hasFinished: status === deploymentStatus.deployed
  }
}

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
      status: provideStatus(requestedDeployment.status),
      tasks: []
    }
  }

  if (requestedDeployment && deploymentTasks.length) {
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
          .map((event) => ({ ...event, status: provideStatus(event.status) }))
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
