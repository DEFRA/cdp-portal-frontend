// Response from portalBackendApi/v2/whats-running-where
const whatsRunningWhereFixture = [
  {
    cdpDeploymentId: '3c439dc3-014f-47ef-9433-57ef0a10d8aa',
    lambdaId: 'ecs-svc/5038252746496072911',
    environment: 'infra-dev',
    service: 'cdp-portal-frontend',
    version: '0.356.0',
    user: {
      userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
      name: 'RoboCop'
    },
    cpu: '1024',
    memory: '2048',
    instanceCount: 1,
    created: '2024-05-10T14:48:34.001Z',
    updated: '2024-05-10T14:49:42Z',
    instances: {
      'arn:aws:ecs:eu-west-2:506190012364:task/infra-dev-ecs-public/cb7de56df13e4c7fa3042b644a07b97e':
        {
          status: 'running',
          updated: '2024-05-10T14:49:42Z'
        }
    },
    status: 'running',
    unstable: false,
    configVersion: null,
    secrets: {
      keys: [],
      lastChangedDate: '',
      createdDate: ''
    },
    lastDeploymentStatus: null,
    lastDeploymentMessage: null,
    deploymentTestRuns: [],
    taskDefinitionArn: null
  },
  {
    cdpDeploymentId: '7c3e6971-fca4-4eef-a075-20ff5d72fadf',
    lambdaId: 'ecs-svc/2889706505373554708',
    environment: 'infra-dev',
    service: 'cdp-user-service-backend',
    version: '0.149.0',
    user: {
      userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
      name: 'RoboCop'
    },
    cpu: '2048',
    memory: '4096',
    instanceCount: 1,
    created: '2024-07-23T23:03:55.79Z',
    updated: '2024-05-10T14:54:15Z',
    instances: {
      'arn:aws:ecs:eu-west-2:506190012364:task/infra-dev-ecs-protected/b2ab8209eb2b431a810c336c2b95a7cd':
        {
          status: 'running',
          updated: '2024-05-10T14:54:15Z'
        }
    },
    status: 'running',
    unstable: false,
    configVersion: 'f4982d32ea8788b6c6a9b9f6a9306820fdb865c4',
    secrets: {
      keys: [],
      lastChangedDate: '2024-08-02T14:10:17.3880790Z',
      createdDate: '2024-07-14T08:11:00'
    },
    lastDeploymentStatus: null,
    lastDeploymentMessage: null,
    deploymentTestRuns: [],
    taskDefinitionArn: null
  },
  {
    cdpDeploymentId: '1cb3f2b1-b06c-449f-a562-bfcaca7fe162',
    lambdaId: 'ecs-svc/9930243607684993868',
    environment: 'management',
    service: 'cdp-self-service-ops',
    version: '0.188.0',
    user: {
      userId: '0ddadf17-beaf-4aef-a415-ca044dbdd18d',
      name: 'The Terminator'
    },
    cpu: '1024',
    memory: '2048',
    instanceCount: 1,
    created: '2024-04-25T10:26:26.604Z',
    updated: '2024-04-25T10:27:58Z',
    instances: {
      'arn:aws:ecs:eu-west-2:094954420758:task/management-ecs-protected/c3b56ff485cf4438b4f152c510625ac3':
        {
          status: 'running',
          updated: '2024-04-25T10:27:58Z'
        }
    },
    status: 'running',
    unstable: false,
    configVersion: null,
    secrets: {
      keys: [],
      lastChangedDate: '',
      createdDate: ''
    },
    lastDeploymentStatus: null,
    lastDeploymentMessage: null,
    deploymentTestRuns: [],
    taskDefinitionArn: null
  }
]

export { whatsRunningWhereFixture }
