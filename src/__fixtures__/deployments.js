// Response from portalBackendApi/deployments

const deploymentsFixture = {
  deployments: [
    {
      deploymentId: '7dda5224-84c0-4a67-a64f-04e55d95befb',
      environment: 'infra-dev',
      service: 'cdp-self-service-ops',
      version: '0.133.0',
      user: 'B. A. Baracus',
      userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
      createdAt: '2023-12-14T14:04:49Z',
      updatedAt: '2023-12-14T14:10:49Z',
      status: 'RUNNING',
      dockerImage:
        '123456789.dkr.ecr.eu-west-2.amazonaws.com/cdp-self-service-ops:0.133.0',
      taskId:
        'arn:aws:ecs:eu-west-2:123412341234:task-definition/cdp-self-service-ops:77',
      ecsSvcDeploymentId: 'ecs-svc/0104156151283823124',
      cpu: '1024',
      memory: '2048',
      instanceTaskId:
        'arn:aws:ecs:eu-west-2:123412341234:task/infra-dev-ecs-protected/c401cfebbac648839c60206d0ce9cbcb',
      instanceCount: 1
    },
    {
      deploymentId: 'cfa44a59-dc21-4481-a0a4-e829b2ddb56a',
      environment: 'infra-dev',
      service: 'cdp-user-service-backend',
      version: '0.54.0',
      user: 'B. A. Baracus',
      userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
      createdAt: '2023-12-14T14:02:34Z',
      updatedAt: '2023-12-14T14:10:34Z',
      status: 'RUNNING',
      dockerImage:
        '123456789.dkr.ecr.eu-west-2.amazonaws.com/cdp-user-service-backend:0.54.0',
      taskId:
        'arn:aws:ecs:eu-west-2:123412341234:task-definition/cdp-user-service-backend:42',
      ecsSvcDeploymentId: 'ecs-svc/3014741994541337123',
      cpu: '1024',
      memory: '2048',
      instanceTaskId:
        'arn:aws:ecs:eu-west-2:123412341234:task/infra-dev-ecs-protected/45483810f6c443c19ffbc0bd875dd51e',
      instanceCount: 1
    },
    {
      deploymentId: '836ba007-d87d-4b7a-9e94-ee5e19619d41',
      environment: 'infra-dev',
      service: 'cdp-portal-backend',
      version: '0.94.0',
      user: 'B. A. Baracus',
      userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
      createdAt: '2023-12-14T13:58:13Z',
      updatedAt: '2023-12-14T14:58:13Z',
      status: 'RUNNING',
      dockerImage:
        '123456789.dkr.ecr.eu-west-2.amazonaws.com/cdp-portal-backend:0.94.0',
      taskId:
        'arn:aws:ecs:eu-west-2:123412341234:task-definition/cdp-portal-backend:104',
      ecsSvcDeploymentId: 'ecs-svc/1704294635461875969',
      cpu: '2048',
      memory: '4096',
      instanceTaskId:
        'arn:aws:ecs:eu-west-2:123412341234:task/infra-dev-ecs-protected/d6aa24e0d4fe4299b8a3f4fd0c05eba6',
      instanceCount: 1
    },
    {
      deploymentId: '2daa0c1c-f3cb-4435-8a54-6ad77780e466',
      environment: 'infra-dev',
      service: 'cdp-portal-frontend',
      version: '0.211.0',
      user: 'B. A. Baracus',
      userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
      createdAt: '2023-12-14T13:40:52Z',
      updatedAt: '2023-12-14T13:50:52Z',
      status: 'RUNNING',
      dockerImage:
        '123456789.dkr.ecr.eu-west-2.amazonaws.com/cdp-portal-frontend:0.211.0',
      taskId:
        'arn:aws:ecs:eu-west-2:123412341234:task-definition/cdp-portal-frontend:138',
      ecsSvcDeploymentId: 'ecs-svc/6234389216168804118',
      cpu: '1024',
      memory: '2048',
      instanceTaskId:
        'arn:aws:ecs:eu-west-2:123412341234:task/infra-dev-ecs-public/593080e9348c432686c35c9cb57e24a2',
      instanceCount: 2
    }
  ],
  page: 1,
  pageSize: 20,
  totalPages: 1
}

export { deploymentsFixture }
