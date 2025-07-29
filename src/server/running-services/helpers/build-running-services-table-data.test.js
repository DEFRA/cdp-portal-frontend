import { fetchRunningServices } from './fetch/fetch-running-services.js'
import { fetchServices } from '../../common/helpers/fetch/fetch-entities.js'
import { entityServicesFixture } from '../../../__fixtures__/services/entities.js'
import { buildRunningServicesTableData } from './build-running-services-table-data.js'
import { fetchRunningServicesFilters } from './fetch/fetch-running-services-filters.js'
import { runningServicesFiltersFixture } from '../../../__fixtures__/running-services/filters.js'
import { runningServicesFixture } from '../../../__fixtures__/running-services/running-services.js'

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
      pre: { authedUser: { scope: ['admin'], uuidScope: [] } },
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
          cells: [
            {
              headers: 'owner',
              isCentered: true,
              classes: 'app-entity-table__cell--owned',
              entity: {
                kind: 'html',
                value: ''
              }
            },
            {
              headers: 'service',
              entity: {
                kind: 'link',
                value: 'cdp-portal-frontend',
                url: '/running-services/cdp-portal-frontend'
              }
            },
            {
              headers: 'team',
              entity: {
                kind: 'group',
                value: [
                  {
                    kind: 'link',
                    value: 'Platform',
                    url: '/teams/aabe63e7-87ef-4beb-a596-c810631fc474'
                  }
                ]
              }
            },
            {
              headers: 'infra-dev',
              isSlim: true,
              entity: {
                kind: 'html',
                value: expect.stringContaining('Deployed')
              }
            },
            {
              headers: 'management',
              isSlim: true,
              html: '<div class="app-running-service-entity--empty"></div>'
            },
            {
              headers: 'dev',
              isSlim: true,
              html: '<div class="app-running-service-entity--empty"></div>'
            },
            {
              headers: 'test',
              isSlim: true,
              html: '<div class="app-running-service-entity--empty"></div>'
            },
            {
              headers: 'perf-test',
              isSlim: true,
              html: '<div class="app-running-service-entity--empty"></div>'
            },
            {
              headers: 'prod',
              isSlim: true,
              html: '<div class="app-running-service-entity--empty"></div>'
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
      pre: { authedUser: { scope: [], uuidScope: [] } },
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
        pre: { authedUser: { scope: [], uuidScope: [] } },
        query: {}
      })
    ).rejects.toThrow('Fetch failed')
  })
})
