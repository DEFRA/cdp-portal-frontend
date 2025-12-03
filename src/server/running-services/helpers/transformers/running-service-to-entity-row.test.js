import { runningServicesFixture } from '../../../../__fixtures__/running-services/running-services.js'
import { transformRunningServices } from './running-services.js'
import { runningServiceToEntityRow } from './running-service-to-entity-row.js'
import { entityServicesFixture } from '../../../../__fixtures__/services/entities.js'

describe('#runningServiceToEntityRow', () => {
  const adminGroupId = 'team:aabe63e7-87ef-4beb-a596-c810631fc474'
  const runningServices = runningServicesFixture
  const deployableServices = entityServicesFixture
  const userScopes = [adminGroupId]

  const services = transformRunningServices({
    runningServices,
    deployableServices,
    userScopes
  })
  const firstService = services.at(0)

  describe('When authenticated', () => {
    test('Should return the correct row structure', () => {
      const result = runningServiceToEntityRow(firstService)

      expect(result).toEqual({
        isOwner: true,
        serviceEnvironments: {
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
              displayName: 'RoboCop',
              id: '01b99595-27b5-4ab0-9807-f104c09d2cd0'
            },
            version: '0.356.0'
          }
        },
        serviceName: 'cdp-portal-frontend',
        serviceTeams: [
          {
            name: 'Platform',
            teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
          }
        ]
      })
    })
  })

  test('Should handle services without environments', () => {
    const serviceDataWithoutEnvironments = {
      ...firstService,
      environments: {}
    }
    const result = runningServiceToEntityRow(serviceDataWithoutEnvironments)
    expect(result).toEqual({
      isOwner: true,
      serviceEnvironments: {},
      serviceName: 'cdp-portal-frontend',
      serviceTeams: [
        {
          name: 'Platform',
          teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474'
        }
      ]
    })
  })
})
