// Response from portalBackendApi/deployments/3f5dff54-9bea-4a53-830d-96610af8c2b4

const deploymentSuccessFixture = [
  {
    deploymentId: '3f5dff54-9bea-4a53-830d-96610af8c2b4',
    environment: 'management',
    service: 'cdp-portal-frontend',
    version: '0.225.0',
    user: 'RoboCop',
    userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
    deployedAt: '2024-01-16T17:23:15.738Z',
    status: 'REQUESTED',
    dockerImage: 'cdp-portal-frontend',
    taskId: null,
    ecsSvcDeploymentId: 'ecs-svc/8544336582308964577',
    cpu: null,
    memory: null,
    instanceTaskId: null,
    instanceCount: 2
  },
  {
    deploymentId: '3f5dff54-9bea-4a53-830d-96610af8c2b4',
    environment: 'management',
    service: 'cdp-portal-frontend',
    version: '0.225.0',
    user: 'RoboCop',
    userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
    deployedAt: '2024-01-16T17:23:52Z',
    status: 'PENDING',
    dockerImage:
      '123456789.dkr.ecr.eu-west-2.amazonaws.com/cdp-portal-frontend:0.225.0',
    taskId:
      'arn:aws:ecs:eu-west-2:123456789:task-definition/cdp-portal-frontend:108',
    ecsSvcDeploymentId: 'ecs-svc/8544336582308964577',
    cpu: '1024',
    memory: '2048',
    instanceTaskId:
      'arn:aws:ecs:eu-west-2:123456789:task/management-ecs-public/9bbfdb65e16449a781107c40d2bd175e',
    instanceCount: 2
  },
  {
    deploymentId: '3f5dff54-9bea-4a53-830d-96610af8c2b4',
    environment: 'management',
    service: 'cdp-portal-frontend',
    version: '0.225.0',
    user: 'RoboCop',
    userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
    deployedAt: '2024-01-16T17:24:23Z',
    status: 'RUNNING',
    dockerImage:
      '123456789.dkr.ecr.eu-west-2.amazonaws.com/cdp-portal-frontend:0.225.0',
    taskId:
      'arn:aws:ecs:eu-west-2:123456789:task-definition/cdp-portal-frontend:108',
    ecsSvcDeploymentId: 'ecs-svc/8544336582308964577',
    cpu: '1024',
    memory: '2048',
    instanceTaskId:
      'arn:aws:ecs:eu-west-2:123456789:task/management-ecs-public/9bbfdb65e16449a781107c40d2bd175e',
    instanceCount: 2
  },
  {
    deploymentId: '3f5dff54-9bea-4a53-830d-96610af8c2b4',
    environment: 'management',
    service: 'cdp-portal-frontend',
    version: '0.225.0',
    user: 'RoboCop',
    userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
    deployedAt: '2024-01-16T17:23:55Z',
    status: 'PENDING',
    dockerImage:
      '123456789.dkr.ecr.eu-west-2.amazonaws.com/cdp-portal-frontend:0.225.0',
    taskId:
      'arn:aws:ecs:eu-west-2:123456789:task-definition/cdp-portal-frontend:108',
    ecsSvcDeploymentId: 'ecs-svc/8544336582308964577',
    cpu: '1024',
    memory: '2048',
    instanceTaskId:
      'arn:aws:ecs:eu-west-2:123456789:task/management-ecs-public/118daf6fe0fe4893bff72048f25fc67e',
    instanceCount: 2
  },
  {
    deploymentId: '3f5dff54-9bea-4a53-830d-96610af8c2b4',
    environment: 'management',
    service: 'cdp-portal-frontend',
    version: '0.225.0',
    user: 'RoboCop',
    userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
    deployedAt: '2024-01-16T17:24:27Z',
    status: 'RUNNING',
    dockerImage:
      '123456789.dkr.ecr.eu-west-2.amazonaws.com/cdp-portal-frontend:0.225.0',
    taskId:
      'arn:aws:ecs:eu-west-2:123456789:task-definition/cdp-portal-frontend:108',
    ecsSvcDeploymentId: 'ecs-svc/8544336582308964577',
    cpu: '1024',
    memory: '2048',
    instanceTaskId:
      'arn:aws:ecs:eu-west-2:123456789:task/management-ecs-public/118daf6fe0fe4893bff72048f25fc67e',
    instanceCount: 2
  }
]

export { deploymentSuccessFixture }
