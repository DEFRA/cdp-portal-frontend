// Response from portalBackendApi/deployments

const deploymentsFixture = {
  data: [
    {
      cdpDeploymentId: '7dda5224-84c0-4a67-a64f-04e55d95befb',
      ecsSvcDeploymentId: 'ecs-svc/0104156151283823124',
      environment: 'infra-dev',
      service: 'cdp-self-service-ops',
      version: '0.133.0',
      user: {
        displayName: 'B. A. Baracus',
        userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec'
      },
      cpu: '1024',
      memory: '2048',
      instanceCount: 1,
      created: '2023-12-14T14:04:49Z',
      updated: '2023-12-14T14:10:49Z',
      instances: {
        'arn:aws:ecs:eu-west-2:000000000000:task/dev-ecs-public/f073ea3b-3715-4ee3-b847-c736949ae93c':
          {
            status: 'running',
            updated: '2024-03-08T22:21:35.669Z'
          }
      },
      status: 'running',
      unstable: false
    },
    {
      deploymentId: 'cfa44a59-dc21-4481-a0a4-e829b2ddb56a',
      environment: 'infra-dev',
      service: 'cdp-user-service-backend',
      version: '0.54.0',
      user: 'B. A. Baracus',
      userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
      created: '2023-12-14T14:02:34Z',
      updated: '2023-12-14T14:10:34Z',
      status: 'running',
      cpu: '1024',
      memory: '2048',
      instanceCount: 1,
      instances: {
        'arn:aws:ecs:eu-west-2:000000000000:task/dev-ecs-public/f073ea3b-3715-4ee3-b847-c736949ae93c':
          {
            status: 'running',
            updated: '2024-03-08T22:21:35.669Z'
          }
      }
    },
    {
      cdpDeploymentId: '7dda5224-84c0-4a67-a64f-04e55d95befb',
      ecsSvcDeploymentId: 'ecs-svc/0104156151283823124',
      environment: 'infra-dev',
      service: 'cdp-portal-backend',
      version: '0.94.0',
      user: {
        displayName: 'B. A. Baracus',
        userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec'
      },
      cpu: '1024',
      memory: '2048',
      instanceCount: 1,
      created: '2023-12-14T13:58:13Z',
      updated: '2023-12-14T14:58:13Z',
      instances: {
        'arn:aws:ecs:eu-west-2:000000000000:task/dev-ecs-public/f073ea3b-3715-4ee3-b847-c736949ae93c':
          {
            status: 'running',
            updated: '2024-03-08T22:21:35.669Z'
          }
      },
      status: 'running',
      unstable: false
    },

    {
      cdpDeploymentId: '7dda5224-84c0-4a67-a64f-04e55d95befb',
      ecsSvcDeploymentId: 'ecs-svc/0104156151283823124',
      environment: 'infra-dev',
      service: 'cdp-portal-frontend',
      version: '0.211.0',
      user: {
        displayName: 'B. A. Baracus',
        userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec'
      },
      cpu: '1024',
      memory: '2048',
      instanceCount: 1,
      created: '2023-12-14T13:40:52Z',
      updated: '2023-12-14T13:50:52Z',
      instances: {
        'arn:aws:ecs:eu-west-2:000000000000:task/dev-ecs-public/f073ea3b-3715-4ee3-b847-c736949ae93c':
          {
            status: 'running',
            updated: '2024-03-08T22:21:35.669Z'
          },
        'arn:aws:ecs:eu-west-2:000000000000:task/dev-ecs-public/f073ea3b-3715-4ee3-b847-c736949ae93b':
          {
            status: 'running',
            updated: '2024-03-08T22:21:35.669Z'
          }
      },
      status: 'running',
      unstable: false
    }
  ],
  page: 1,
  pageSize: 20,
  totalPages: 1
}

export { deploymentsFixture }
