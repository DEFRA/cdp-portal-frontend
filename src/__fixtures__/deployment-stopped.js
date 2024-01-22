// Response from portalBackendApi/deployments/3f5dff54-9bea-4a53-830d-96610af8c2b4

const deploymentStoppedFixture = [
  {
    deploymentId: '2380b759-a76d-4f5b-8253-dd7b9545e161',
    environment: 'infra-dev',
    service: 'cdp-portal-backend',
    version: '0.105.0',
    user: 'RoboCop',
    userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
    deployedAt: '2024-01-22T08:27:55.539Z',
    status: 'REQUESTED',
    dockerImage: 'cdp-portal-backend',
    taskId: null,
    ecsSvcDeploymentId: 'ecs-svc/2729145637959376974',
    cpu: null,
    memory: null,
    instanceTaskId: null,
    instanceCount: 1
  },
  {
    deploymentId: '2380b759-a76d-4f5b-8253-dd7b9545e161',
    environment: 'infra-dev',
    service: 'cdp-portal-backend',
    version: '0.105.0',
    user: 'RoboCop',
    userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
    deployedAt: '2024-01-22T08:28:15Z',
    status: 'PENDING',
    dockerImage:
      '123456789.dkr.ecr.eu-west-2.amazonaws.com/cdp-portal-backend:0.105.0',
    taskId:
      'arn:aws:ecs:eu-west-2:506190012364:task-definition/cdp-portal-backend:121',
    ecsSvcDeploymentId: 'ecs-svc/2729145637959376974',
    cpu: '2048',
    memory: '4096',
    instanceTaskId:
      'arn:aws:ecs:eu-west-2:506190012364:task/infra-dev-ecs-protected/d74cdc42ff1b44f49fe007e858567bfa',
    instanceCount: 1
  },
  {
    deploymentId: '2380b759-a76d-4f5b-8253-dd7b9545e161',
    environment: 'infra-dev',
    service: 'cdp-portal-backend',
    version: '0.105.0',
    user: 'RoboCop',
    userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
    deployedAt: '2024-01-22T08:28:27Z',
    status: 'PENDING',
    dockerImage:
      '123456789.dkr.ecr.eu-west-2.amazonaws.com/cdp-portal-backend:0.105.0',
    taskId:
      'arn:aws:ecs:eu-west-2:506190012364:task-definition/cdp-portal-backend:121',
    ecsSvcDeploymentId: 'ecs-svc/2729145637959376974',
    cpu: '2048',
    memory: '4096',
    instanceTaskId:
      'arn:aws:ecs:eu-west-2:506190012364:task/infra-dev-ecs-protected/d74cdc42ff1b44f49fe007e858567bfa',
    instanceCount: 1
  },
  {
    deploymentId: '2380b759-a76d-4f5b-8253-dd7b9545e161',
    environment: 'infra-dev',
    service: 'cdp-portal-backend',
    version: '0.105.0',
    user: 'RoboCop',
    userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
    deployedAt: '2024-01-22T08:28:48Z',
    status: 'RUNNING',
    dockerImage:
      '123456789.dkr.ecr.eu-west-2.amazonaws.com/cdp-portal-backend:0.105.0',
    taskId:
      'arn:aws:ecs:eu-west-2:506190012364:task-definition/cdp-portal-backend:121',
    ecsSvcDeploymentId: 'ecs-svc/2729145637959376974',
    cpu: '2048',
    memory: '4096',
    instanceTaskId:
      'arn:aws:ecs:eu-west-2:506190012364:task/infra-dev-ecs-protected/d74cdc42ff1b44f49fe007e858567bfa',
    instanceCount: 1
  },
  {
    deploymentId: '2380b759-a76d-4f5b-8253-dd7b9545e161',
    environment: 'infra-dev',
    service: 'cdp-portal-backend',
    version: '0.105.0',
    user: 'RoboCop',
    userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
    deployedAt: '2024-01-22T08:29:01Z',
    status: 'RUNNING',
    dockerImage:
      '123456789.dkr.ecr.eu-west-2.amazonaws.com/cdp-portal-backend:0.105.0',
    taskId:
      'arn:aws:ecs:eu-west-2:506190012364:task-definition/cdp-portal-backend:121',
    ecsSvcDeploymentId: 'ecs-svc/2729145637959376974',
    cpu: '2048',
    memory: '4096',
    instanceTaskId:
      'arn:aws:ecs:eu-west-2:506190012364:task/infra-dev-ecs-protected/d74cdc42ff1b44f49fe007e858567bfa',
    instanceCount: 1
  },
  {
    deploymentId: '2380b759-a76d-4f5b-8253-dd7b9545e161',
    environment: 'infra-dev',
    service: 'cdp-portal-backend',
    version: '0.105.0',
    user: 'RoboCop',
    userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
    deployedAt: '2024-01-22T09:53:04Z',
    status: 'STOPPED',
    dockerImage:
      '123456789.dkr.ecr.eu-west-2.amazonaws.com/cdp-portal-backend:0.105.0',
    taskId:
      'arn:aws:ecs:eu-west-2:506190012364:task-definition/cdp-portal-backend:121',
    ecsSvcDeploymentId: 'ecs-svc/2729145637959376974',
    cpu: '2048',
    memory: '4096',
    instanceTaskId:
      'arn:aws:ecs:eu-west-2:506190012364:task/infra-dev-ecs-protected/d74cdc42ff1b44f49fe007e858567bfa',
    instanceCount: 1
  }
]

export { deploymentStoppedFixture }
