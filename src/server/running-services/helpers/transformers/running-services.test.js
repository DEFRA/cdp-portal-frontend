import { config } from '~/src/config/config.js'
import { transformRunningServices } from './running-services.js'
import { servicesFixture } from '~/src/__fixtures__/services/services.js'
import { whatsRunningWhereFixture } from '~/src/__fixtures__/whats-running-where.js'

describe('transformRunningServices', () => {
  const oidcAdminGroupId = config.get('oidcAdminGroupId')

  test('should transform running services correctly', () => {
    const runningServices = whatsRunningWhereFixture
    const deployableServices = servicesFixture
    const userScopeUUIDs = [oidcAdminGroupId]

    const result = transformRunningServices({
      runningServices,
      deployableServices,
      userScopeUUIDs
    })

    expect(result).toEqual([
      {
        environments: {
          'infra-dev': {
            cdpDeploymentId: '3c439dc3-014f-47ef-9433-57ef0a10d8aa',
            configVersion: null,
            cpu: '1024',
            created: '2024-05-10T14:48:34.001Z',
            deploymentTestRuns: [],
            environment: 'infra-dev',
            instanceCount: 1,
            instances: {
              'arn:aws:ecs:eu-west-2:506190012364:task/infra-dev-ecs-public/cb7de56df13e4c7fa3042b644a07b97e':
                {
                  status: 'running',
                  updated: '2024-05-10T14:49:42Z'
                }
            },
            lambdaId: 'ecs-svc/5038252746496072911',
            lastDeploymentMessage: null,
            lastDeploymentStatus: null,
            memory: '2048',
            secrets: {
              createdDate: '',
              keys: [],
              lastChangedDate: ''
            },
            service: 'cdp-portal-frontend',
            status: 'running',
            statusClassname: 'item-detail--green',
            taskDefinitionArn: null,
            unstable: false,
            updated: '2024-05-10T14:49:42Z',
            user: {
              name: 'RoboCop',
              userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec'
            },
            version: '0.356.0'
          }
        },
        serviceName: 'cdp-portal-frontend',
        teams: [
          {
            github: 'cdp-platform',
            name: 'Platform',
            teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
          }
        ],
        userOwnsService: true
      },
      {
        environments: {
          management: {
            cdpDeploymentId: '1cb3f2b1-b06c-449f-a562-bfcaca7fe162',
            configVersion: null,
            cpu: '1024',
            created: '2024-04-25T10:26:26.604Z',
            deploymentTestRuns: [],
            environment: 'management',
            instanceCount: 1,
            instances: {
              'arn:aws:ecs:eu-west-2:094954420758:task/management-ecs-protected/c3b56ff485cf4438b4f152c510625ac3':
                {
                  status: 'running',
                  updated: '2024-04-25T10:27:58Z'
                }
            },
            lambdaId: 'ecs-svc/9930243607684993868',
            lastDeploymentMessage: null,
            lastDeploymentStatus: null,
            memory: '2048',
            secrets: {
              createdDate: '',
              keys: [],
              lastChangedDate: ''
            },
            service: 'cdp-self-service-ops',
            status: 'running',
            statusClassname: 'item-detail--green',
            taskDefinitionArn: null,
            unstable: false,
            updated: '2024-04-25T10:27:58Z',
            user: {
              name: 'The Terminator',
              userId: '0ddadf17-beaf-4aef-a415-ca044dbdd18d'
            },
            version: '0.188.0'
          }
        },
        serviceName: 'cdp-self-service-ops',
        teams: [],
        userOwnsService: false
      },
      {
        environments: {
          'infra-dev': {
            cdpDeploymentId: '7c3e6971-fca4-4eef-a075-20ff5d72fadf',
            configVersion: 'f4982d32ea8788b6c6a9b9f6a9306820fdb865c4',
            cpu: '2048',
            created: '2024-07-23T23:03:55.79Z',
            deploymentTestRuns: [],
            environment: 'infra-dev',
            instanceCount: 1,
            instances: {
              'arn:aws:ecs:eu-west-2:506190012364:task/infra-dev-ecs-protected/b2ab8209eb2b431a810c336c2b95a7cd':
                {
                  status: 'running',
                  updated: '2024-05-10T14:54:15Z'
                }
            },
            lambdaId: 'ecs-svc/2889706505373554708',
            lastDeploymentMessage: null,
            lastDeploymentStatus: null,
            memory: '4096',
            secrets: {
              createdDate: '2024-07-14T08:11:00',
              keys: [],
              lastChangedDate: '2024-08-02T14:10:17.3880790Z'
            },
            service: 'cdp-user-service-backend',
            status: 'running',
            statusClassname: 'item-detail--green',
            taskDefinitionArn: null,
            unstable: false,
            updated: '2024-05-10T14:54:15Z',
            user: {
              name: 'RoboCop',
              userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec'
            },
            version: '0.149.0'
          }
        },
        serviceName: 'cdp-user-service-backend',
        teams: [
          {
            github: 'cdp-platform',
            name: 'Platform',
            teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
          }
        ],
        userOwnsService: true
      }
    ])
  })

  test('should handle empty running services', () => {
    const runningServices = []
    const deployableServices = []
    const userScopeUUIDs = []

    const result = transformRunningServices({
      runningServices,
      deployableServices,
      userScopeUUIDs
    })

    expect(result).toEqual([])
  })
})
