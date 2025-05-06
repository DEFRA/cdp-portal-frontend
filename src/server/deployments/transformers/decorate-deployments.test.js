import { decorateDeployments } from '~/src/server/deployments/transformers/decorate-deployments.js'
import { servicesFixture } from '~/src/__fixtures__/services/services.js'
import { deploymentsWithMigrationsFixture } from '~/src/__fixtures__/deployments/deployments-with-migrations.js'

describe('#decorateDeployments', () => {
  test('Should decorate deployable with teams and owner information', () => {
    const mockUserScopeUUIDs = ['aabe63e7-87ef-4beb-a596-c810631fc474']
    const decorator = decorateDeployments({
      deployableServices: servicesFixture,
      userScopeUUIDs: mockUserScopeUUIDs
    })

    expect(decorator(deploymentsWithMigrationsFixture.data)).toEqual([
      {
        cdpDeploymentId: '3c439dc3-014f-47ef-9433-57ef0a10d8aa',
        configVersion: null,
        cpu: '1024',
        created: '2025-04-30T14:48:34.001Z',
        deploymentTestRuns: [],
        environment: 'dev',
        instanceCount: 1,
        instances: {
          'arn:aws:ecs:eu-west-2:506190012364:task/infra-dev-ecs-public/cb7de56df13e4c7fa3042b644a07b97e':
            {
              status: 'running',
              updated: '2024-05-10T14:49:42Z'
            }
        },
        isFavourite: true,
        kind: 'deployment',
        lambdaId: 'ecs-svc/5038252746496072911',
        lastDeploymentMessage:
          'ECS deployment ecs-svc/5038252746496072911 completed.',
        lastDeploymentStatus: 'SERVICE_DEPLOYMENT_COMPLETED',
        memory: '2048',
        secrets: {
          createdDate: '',
          keys: [],
          lastChangedDate: ''
        },
        service: 'cdp-example-node-postgres-be',
        status: 'running',
        taskDefinitionArn: null,
        teams: [],
        unstable: false,
        updated: '2025-04-30T14:49:42Z',
        user: {
          displayName: 'Mumm-ra',
          id: '01b99595-27b5-4ab0-9807-f104c09d2cd0'
        },
        version: '0.356.0'
      },
      {
        buildId:
          'arn:aws:codebuild:eu-west-2:444444444:build/cdp-example-node-postgres-be-liquibase:8877c7c8-157c-4dc9-9fd3-939731571269',
        cdpMigrationId: 'dec18492-04ac-4b70-bac9-c3ed0f45b50c',
        created: '2025-04-30T09:21:54.816Z',
        environment: 'test',
        isFavourite: true,
        kind: 'migration',
        service: 'cdp-example-node-postgres-be',
        status: 'SUCCEEDED',
        teams: [],
        updated: '2025-04-30T09:21:54.831Z',
        user: {
          displayName: 'B. A. Baracus',
          id: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec'
        },
        version: '0.8.0'
      }
    ])
  })
})
