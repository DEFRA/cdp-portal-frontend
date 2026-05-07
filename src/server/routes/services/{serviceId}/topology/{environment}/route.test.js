import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockServiceEntityCall
} from '#test-helpers/common-page-rendering.js'
import { statusCodes } from '@defra/cdp-validation-kit'
import { fetchTopology } from '#server/services/helpers/fetch/fetch-topology.js'

vi.mock('#server/common/helpers/fetch/fetch-entities.js')
vi.mock('#server/common/helpers/auth/get-user-session.js')
vi.mock('#server/services/helpers/fetch/fetch-shuttering-urls.js')
vi.mock('#server/services/helpers/fetch/fetch-topology.js')

const serviceName = 'mock-service-with-resources'

describe('Topology page', () => {
  let server

  beforeAll(async () => {
    mockServiceEntityCall(serviceName)
    fetchTopology.mockResolvedValue([
      {
        name: serviceName,
        type: 'Backend',
        teams: [
          {
            teamId: 'platform',
            name: 'Platform'
          }
        ],
        resources: [
          {
            name: 'decision_notification',
            type: 'sns',
            icon: 'aws-sns',
            links: []
          },
          {
            name: 'error_notification',
            type: 'sns',
            icon: 'aws-sns',
            links: []
          },
          {
            name: 'message_clearance_request',
            type: 'sqs',
            icon: 'aws-sqs',
            links: [
              {
                service: null,
                resource: 'error_notification.fifo',
                type: 'sns',
                access: 'subscription'
              }
            ]
          }
        ]
      }
    ])

    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('page renders for logged in admin user', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: `/services/${serviceName}/topology/prod`,
      isAdmin: true,
      isTenant: true
    })

    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })

  test('page DOES NOT render for logged in tenant', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: `/services/${serviceName}/topology/prod`,
      isAdmin: false,
      isTenant: true
    })

    expect(statusCode).toBe(statusCodes.forbidden)
    expect(result).toMatchFile()
  })

  test('page DOES NOT render for logged in service owner tenant', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: `/services/${serviceName}/topology/prod`,
      isAdmin: false,
      isTenant: true,
      teamScope: 'mock-team-id'
    })

    expect(statusCode).toBe(statusCodes.forbidden)
    expect(result).toMatchFile()
  })

  test('page DOES NOT render for logged out user', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: `/services/${serviceName}/topology/prod`,
      isAdmin: false,
      isTenant: false
    })

    expect(statusCode).toBe(statusCodes.unauthorized)
    expect(result).toMatchFile()
  })
})
