// Response from portalBackendApi/deployments/3f5dff54-9bea-4a53-830d-96610af8c2b4

const deploymentInProgressFixture = {
  cdpDeploymentId: '803cdad9-7556-4cbe-8039-d1caaeeb29b7',
  lambdaId: 'ecs-svc/7f1cefc5-5e49-410f-a938-ffb5dfc86da1',
  environment: 'perf-test',
  service: 'cdp-portal-frontend',
  version: '0.225.0',
  user: {
    id: '90552794-0613-4023-819a-512aa9d40023',
    displayName: 'RoboCop'
  },
  cpu: '1024',
  memory: '2048',
  instanceCount: 2,
  created: '2024-03-08T22:21:35.398Z',
  updated: '2024-03-08T22:21:35.87Z',
  instances: {
    'arn:aws:ecs:eu-west-2:000000000000:task/dev-ecs-public/f073ea3b-3715-4ee3-b847-c736949ae93c':
      {
        status: 'pending',
        updated: '2024-03-08T22:21:35.669Z'
      },
    'arn:aws:ecs:eu-west-2:000000000000:task/dev-ecs-public/7bd9d603-9bc8-4fe0-b8d2-d64e9c9c75dc':
      {
        status: 'running',
        updated: '2024-03-08T22:21:35.87Z'
      }
  },
  status: 'pending',
  unstable: false
}

export { deploymentInProgressFixture }
