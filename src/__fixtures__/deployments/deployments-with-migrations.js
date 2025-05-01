// Response from portalBackendApi/deployments-with-migrations

const deploymentsWithMigrationsFixture = {
  data: [
    {
      deployment: {
        cdpDeploymentId: '3c439dc3-014f-47ef-9433-57ef0a10d8aa',
        lambdaId: 'ecs-svc/5038252746496072911',
        environment: 'dev',
        service: 'cdp-example-node-postgres-be',
        version: '0.356.0',
        user: {
          id: '01b99595-27b5-4ab0-9807-f104c09d2cd0',
          displayName: 'Mumm-ra'
        },
        cpu: '1024',
        memory: '2048',
        instanceCount: 1,
        created: '2025-04-30T14:48:34.001Z',
        updated: '2025-04-30T14:49:42Z',
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
        lastDeploymentStatus: 'SERVICE_DEPLOYMENT_COMPLETED',
        lastDeploymentMessage:
          'ECS deployment ecs-svc/5038252746496072911 completed.',
        deploymentTestRuns: [],
        taskDefinitionArn: null
      },
      migration: null,
      updated: '2025-04-30T14:49:42Z'
    },
    {
      deployment: null,
      migration: {
        cdpMigrationId: 'dec18492-04ac-4b70-bac9-c3ed0f45b50c',
        buildId:
          'arn:aws:codebuild:eu-west-2:444444444:build/cdp-example-node-postgres-be-liquibase:8877c7c8-157c-4dc9-9fd3-939731571269',
        service: 'cdp-example-node-postgres-be',
        environment: 'test',
        version: '0.8.0',
        kind: 'liquibase',
        user: {
          id: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
          displayName: 'B. A. Baracus'
        },
        created: '2025-04-30T09:21:54.816Z',
        updated: '2025-04-30T09:21:54.831Z',
        status: 'SUCCEEDED'
      },
      updated: '2025-04-30T09:21:54.831Z'
    }
  ],
  page: 1,
  pageSize: 50,
  totalPages: 1
}

export { deploymentsWithMigrationsFixture }
