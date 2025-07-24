import { describe, expect, test } from 'vitest'
import { provideEcsDeploymentStatus } from './provide-ecs-deployment-status.js'
import { deploymentStatus } from '../../common/constants/deployment.js'

describe('provideEcsDeploymentStatus', () => {
  test('should return "Stopping previous deployment." when status is running and message ends with "in progress."', () => {
    const deployment = {
      status: deploymentStatus.running,
      lastDeploymentStatus: 'SERVICE_DEPLOYMENT_IN_PROGRESS',
      lastDeploymentMessage: 'ECS deployment ecs-svc/00000000 in progress.'
    }
    expect(provideEcsDeploymentStatus(deployment).message).toBe(
      'Stopping previous deployment.'
    )
  })

  test('should return "In progress" when status is not running and message ends with "in progress."', () => {
    const deployment = {
      status: deploymentStatus.stopped,
      lastDeploymentStatus: 'SERVICE_DEPLOYMENT_IN_PROGRESS',
      lastDeploymentMessage: 'ECS deployment ecs-svc/00000000 in progress.'
    }
    expect(provideEcsDeploymentStatus(deployment).message).toBe('In progress')
  })

  test('should return the last deployment message when deployment has failed', () => {
    const deployment = {
      status: deploymentStatus.stopped,
      lastDeploymentStatus: 'SERVICE_DEPLOYMENT_FAILED',
      lastDeploymentMessage:
        'ECS deployment circuit breaker: task failed to start.'
    }
    expect(provideEcsDeploymentStatus(deployment).message).toBe(
      'ECS deployment circuit breaker: task failed to start.'
    )
  })

  test('should return "Complete" when deployment status is completed', () => {
    const deployment = {
      status: deploymentStatus.running,
      lastDeploymentStatus: 'SERVICE_DEPLOYMENT_COMPLETED',
      lastDeploymentMessage: 'ECS deployment ecs-svc/00000000 completed.'
    }
    expect(provideEcsDeploymentStatus(deployment).message).toBe('Complete')
  })

  test('should return an empty string for unknown deployment statuses', () => {
    const deployment = {
      status: deploymentStatus.stopped,
      lastDeploymentStatus: 'UNKNOWN_STATUS',
      lastDeploymentMessage: 'Unknown deployment status.'
    }
    expect(provideEcsDeploymentStatus(deployment).message).toBeNull()
  })

  test('should return the last deployment message if it does not end with "in progress."', () => {
    const deployment = {
      status: deploymentStatus.running,
      lastDeploymentStatus: 'SERVICE_DEPLOYMENT_IN_PROGRESS',
      lastDeploymentMessage:
        'ECS deployment circuit breaker: rolling back to deploymentId ecs-svc/00000000.'
    }
    expect(provideEcsDeploymentStatus(deployment).message).toBe(
      'ECS deployment circuit breaker: rolling back to deploymentId ecs-svc/00000000.'
    )
  })
})
