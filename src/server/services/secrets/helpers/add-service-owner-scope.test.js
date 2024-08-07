import { addServiceOwnerScope } from '~/src/server/services/secrets/helpers/add-service-owner-scope'
import { userIsServiceOwnerDecorator } from '~/src/server/common/helpers/user/user-is-service-owner'

describe('#addServiceOwnerScope', () => {
  const mockResponseToolkit = { continue: 'mockContinue' }
  let mockGetUserSession
  let mockFetchDeployableService
  let mockRequest

  beforeEach(() => {
    mockGetUserSession = jest.fn()
    mockFetchDeployableService = jest.fn()
  })

  describe('When authenticated user owns a service', () => {
    beforeEach(() => {
      const teamId = '9e068bb9-1452-426e-a4ca-2e675a942a89'

      // Users session scope array
      mockGetUserSession.mockResolvedValue({
        scope: [teamId]
      })
      // Services teams array
      mockFetchDeployableService.mockResolvedValue({
        teams: [{ teamId }]
      })

      mockRequest = {
        auth: { isAuthenticated: true, credentials: { scope: [] } },
        params: {
          serviceId: 'mock-service-id'
        },
        userIsServiceOwner: userIsServiceOwnerDecorator({
          getUserSession: mockGetUserSession
        }),
        server: {
          methods: { fetchDeployableService: mockFetchDeployableService }
        }
      }
    })

    test('Should have service owner scope', async () => {
      await addServiceOwnerScope(mockRequest, mockResponseToolkit)

      expect(mockRequest.auth.credentials.scope).toEqual(['serviceOwner'])
    })
  })

  describe('When authenticated user does not own a service', () => {
    beforeEach(() => {
      const userTeamId = '9e068bb9-1452-426e-a4ca-2e675a942a89'
      const serviceTeamId = 'aabe63e7-87ef-4beb-a596-c810631fc474'

      // Users session scope array
      mockGetUserSession.mockResolvedValue({
        scope: [userTeamId]
      })
      // Services teams array
      mockFetchDeployableService.mockResolvedValue({
        teams: [{ teamId: serviceTeamId }]
      })

      mockRequest = {
        auth: { isAuthenticated: true, credentials: { scope: [] } },
        params: {
          serviceId: 'mock-service-id'
        },
        userIsServiceOwner: userIsServiceOwnerDecorator({
          getUserSession: mockGetUserSession
        }),
        server: {
          methods: { fetchDeployableService: mockFetchDeployableService }
        }
      }
    })

    test('Should not have service owner scope', async () => {
      await addServiceOwnerScope(mockRequest, mockResponseToolkit)

      expect(mockRequest.auth.credentials.scope).toEqual([])
    })
  })

  describe('With un-authenticated user', () => {
    beforeEach(() => {
      mockRequest = {
        auth: { isAuthenticated: false },
        params: {
          serviceId: 'mock-service-id'
        }
      }
    })

    test('Should have service owner scope', async () => {
      await addServiceOwnerScope(mockRequest, mockResponseToolkit)

      expect(mockRequest.auth?.credentials?.scope).toBeUndefined()
    })
  })
})
