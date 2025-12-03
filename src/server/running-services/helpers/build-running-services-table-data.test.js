import { fetchRunningServices } from './fetch/fetch-running-services.js'
import { fetchServices } from '../../common/helpers/fetch/fetch-entities.js'
import { entityServicesFixture } from '../../../__fixtures__/services/entities.js'
import { buildRunningServicesTableData } from './build-running-services-table-data.js'
import { fetchRunningServicesFilters } from './fetch/fetch-running-services-filters.js'
import { runningServicesFiltersFixture } from '../../../__fixtures__/running-services/filters.js'
import { runningServicesFixture } from '../../../__fixtures__/running-services/running-services.js'
import { scopes } from '@defra/cdp-validation-kit'

vi.mock('./fetch/fetch-running-services-filters.js')
vi.mock('./fetch/fetch-running-services.js')
vi.mock('../../common/helpers/fetch/fetch-entities.js')

describe('#buildRunningServicesTableData', () => {
  test('returns expected table data with valid inputs', async () => {
    fetchServices.mockResolvedValue(entityServicesFixture)
    fetchRunningServicesFilters.mockResolvedValue(runningServicesFiltersFixture)
    // Mimic server side filtering
    fetchRunningServices.mockResolvedValue(
      runningServicesFixture.filter(
        ({ service }) => service === 'cdp-portal-frontend'
      )
    )

    const result = await buildRunningServicesTableData({
      auth: { credentials: { scope: [scopes.admin] } },
      query: {
        service: 'cdp-portal-frontend',
        status: 'running',
        team: 'Platform',
        user: 'RoboCop'
      }
    })

    expect(result).toEqual({
      environments: [
        'infra-dev',
        'management',
        'dev',
        'test',
        'perf-test',
        'prod'
      ],
      rows: [
        {
          isOwner: false,
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
        }
      ],
      serviceFilters: [
        {
          text: ' - - select - - ',
          disabled: true,
          attributes: {
            selected: true
          }
        },
        {
          value: 'cdp-portal-frontend',
          text: 'cdp-portal-frontend'
        },
        {
          value: 'cdp-user-service-backend',
          text: 'cdp-user-service-backend'
        }
      ],
      userFilters: [
        {
          text: ' - - select - - ',
          disabled: true,
          attributes: {
            selected: true
          }
        },
        {
          value: '01b99595-27b5-4ab0-9807-f104c09d2cd0',
          text: 'RoboCop'
        },
        {
          value: '7a34a7f1-55ca-4e6c-9fc6-56220c4280eb',
          text: 'Mumm-ra'
        }
      ],
      statusFilters: [
        {
          text: ' - - select - - ',
          disabled: true,
          attributes: {
            selected: true
          }
        },
        {
          value: 'pending',
          text: 'Pending'
        },
        {
          value: 'running',
          text: 'Running'
        },
        {
          value: 'undeployed',
          text: 'Undeployed'
        }
      ],
      teamFilters: [
        {
          text: ' - - select - - ',
          disabled: true,
          attributes: {
            selected: true
          }
        },
        {
          value: '0be2f4a1-3e1c-4675-a8ec-3af6d453b7ca',
          text: 'Forms'
        },
        {
          value: 'aabe63e7-87ef-4beb-a596-c810631fc474',
          text: 'Platform'
        }
      ]
    })
  })

  test('Should handle empty filters gracefully', async () => {
    fetchServices.mockResolvedValue([])
    fetchRunningServicesFilters.mockResolvedValue({
      filters: { services: [], users: [], statuses: [], teams: [] }
    })
    fetchRunningServices.mockResolvedValue([])

    const result = await buildRunningServicesTableData({
      auth: { credentials: { scope: [] } },
      query: {}
    })

    expect(result).toEqual({
      environments: ['dev', 'test', 'perf-test', 'prod'],
      rows: [],
      serviceFilters: [
        {
          text: ' - - select - - ',
          disabled: true,
          attributes: {
            selected: true
          }
        }
      ],
      userFilters: [
        {
          text: ' - - select - - ',
          disabled: true,
          attributes: {
            selected: true
          }
        }
      ],
      statusFilters: [
        {
          text: ' - - select - - ',
          disabled: true,
          attributes: {
            selected: true
          }
        }
      ],
      teamFilters: [
        {
          text: ' - - select - - ',
          disabled: true,
          attributes: {
            selected: true
          }
        }
      ]
    })
  })

  test('Should throw an error if fetchRunningServices fails', async () => {
    fetchServices.mockResolvedValue([])
    fetchRunningServicesFilters.mockResolvedValue({
      filters: { services: [], users: [], statuses: [], teams: [] }
    })
    fetchRunningServices.mockRejectedValue(new Error('Fetch failed'))

    await expect(
      buildRunningServicesTableData({
        auth: { credentials: { scope: [] } },
        query: {}
      })
    ).rejects.toThrow('Fetch failed')
  })
})
