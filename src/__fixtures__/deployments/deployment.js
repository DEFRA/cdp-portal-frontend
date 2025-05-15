// Response from portalBackendApi/deployments/3c439dc3-014f-47ef-9433-57ef0a10d8aa

const deploymentFixture = {
  cdpDeploymentId: '3c439dc3-014f-47ef-9433-57ef0a10d8aa',
  lambdaId: 'ecs-svc/5038252746496072911',
  environment: 'dev',
  service: 'cdp-portal-frontend',
  version: '0.356.0',
  user: {
    displayName: 'The Terminator',
    id: '0ddadf17-beaf-4aef-a415-ca044dbdd18d'
  },
  cpu: '1024',
  memory: '2048',
  instanceCount: 1,
  created: '2024-05-10T14:48:34.001Z',
  updated: '2024-05-10T14:49:42Z',
  instances: {
    'arn:aws:ecs:eu-west-2:506190012364:task/dev-ecs-public/cb7de56df13e4c7fa3042b644a07b97e':
      {
        status: 'running',
        updated: '2024-05-10T14:49:42Z'
      }
  },
  status: 'running',
  unstable: false,
  configVersion: null,
  secrets: {
    keys: ['BAR', 'FOO', 'REDIS_PASSWORD'],
    lastChangedDate: '2024-05-09T14:31:42Z',
    createdDate: '2024-05-09T14:12:42Z'
  },
  lastDeploymentStatus: 'SERVICE_DEPLOYMENT_COMPLETED',
  lastDeploymentMessage:
    'ECS deployment ecs-svc/5038252746496072911 completed.',
  deploymentTestRuns: [],
  taskDefinitionArn: null
}

export { deploymentFixture }
