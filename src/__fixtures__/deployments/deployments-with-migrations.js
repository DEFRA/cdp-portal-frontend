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
    },
    {
      deployment: {
        cdpDeploymentId: 'a7278885-b997-460f-8d4b-c78dec20ccea',
        lambdaId: 'ecs-svc/585a4722-0d32-4bc6-9d3d-35d3b955e008',
        environment: 'management',
        service: 'cdp-portal-frontend',
        version: '0.356.0',
        user: {
          displayName: 'The Terminator',
          id: '0ddadf17-beaf-4aef-a415-ca044dbdd18d'
        },
        cpu: '1024',
        memory: '2048',
        instanceCount: 2,
        created: '2024-08-28T10:39:55.31Z',
        updated: '2024-08-28T10:39:55.366Z',
        instances: {
          'arn:aws:ecs:eu-west-2:000000000000:task/dev-ecs-public/238c46be-34fd-4c64-85c5-4a5aed6c6eb7':
            {
              status: 'running',
              updated: '2024-08-28T10:39:55.352Z'
            },
          'arn:aws:ecs:eu-west-2:000000000000:task/dev-ecs-public/1c694d60-6b34-4be9-b5f7-22e4c620d2a9':
            {
              status: 'running',
              updated: '2024-08-28T10:39:55.366Z'
            }
        },
        status: 'running',
        unstable: false,
        configVersion: 'aa218f56b14c9653891f9e74264a383fa43fefbd',
        secrets: {
          keys: ['FOO', 'BAR', 'REDIS_PASSWORD'],
          lastChangedDate: null,
          createdDate: null
        },
        lastDeploymentStatus: 'SERVICE_DEPLOYMENT_COMPLETED',
        lastDeploymentMessage:
          'ECS deployment ecs-svc/585a4722-0d32-4bc6-9d3d-35d3b955e008 completed.',
        deploymentTestRuns: [],
        taskDefinitionArn: null
      },
      migration: null,
      created: '2024-08-28T10:39:55.31Z'
    },
    {
      deployment: {
        cdpDeploymentId: '79d0c642-6758-40c3-af35-ba22697d33cf',
        lambdaId: 'ecs-svc/7957605084991218177',
        environment: 'dev',
        service: 'forms-designer',
        version: '0.73.0',
        user: {
          id: '01b99595-27b5-4ab0-9807-f104c09d2cd0',
          displayName: 'Mumm-ra'
        },
        cpu: '2048',
        memory: '4096',
        instanceCount: 2,
        created: '2024-04-19T16:08:23.536Z',
        updated: '2024-04-30T09:46:49Z',
        instances: {
          'arn:aws:ecs:eu-west-2:332499610595:task/dev-ecs-public/d6eb13b402674fab913610136fda725f':
            {
              status: 'stopped',
              updated: '2024-04-30T09:46:49Z'
            },
          'arn:aws:ecs:eu-west-2:332499610595:task/dev-ecs-public/9963bf9cd8094684a285d1c65299ad57':
            {
              status: 'stopped',
              updated: '2024-04-30T09:46:01Z'
            }
        },
        status: 'stopped',
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
      migration: null,
      created: '2024-04-19T16:08:23.536Z'
    },
    {
      deployment: {
        cdpDeploymentId: 'd209be38-adc7-4a53-a1d4-3d6b2b33d4a7',
        lambdaId: 'ecs-svc/4208758342971013853',
        environment: 'management',
        service: 'cdp-user-service-backend',
        version: '0.83.0',
        user: {
          id: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
          displayName: 'B. A. Baracus'
        },
        cpu: '1024',
        memory: '2048',
        instanceCount: 1,
        created: '2024-04-10T13:12:38.878Z',
        updated: '2024-04-24T17:26:07Z',
        instances: {
          'arn:aws:ecs:eu-west-2:094954420758:task/management-ecs-protected/ee98ddb813e24f52bc5110f814432a7d':
            {
              status: 'stopped',
              updated: '2024-04-24T17:26:07Z'
            }
        },
        status: 'stopped',
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
      migration: null,
      created: '2024-04-10T13:12:38.878Z'
    }
  ],
  page: 1,
  pageSize: 50,
  totalPages: 1
}

export { deploymentsWithMigrationsFixture }
