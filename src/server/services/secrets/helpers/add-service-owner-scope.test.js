import { addServiceOwnerScope } from '~/src/server/services/secrets/helpers/add-service-owner-scope'
import { userIsServiceOwnerDecorator } from '~/src/server/common/helpers/user/user-is-service-owner'

describe('#addServiceOwnerScope', () => {
  const mockResponseToolkit = { continue: 'mockContinue' }
  let mockGetUserSession
  let mockRequest

  beforeEach(() => {
    mockGetUserSession = jest.fn()
  })

  describe('When authenticated user owns a service', () => {
    beforeEach(() => {
      const teamId = '9e068bb9-1452-426e-a4ca-2e675a942a89'

      // Users session scope array
      mockGetUserSession.mockResolvedValue({
        scope: [teamId]
      })

      mockRequest = {
        app: {
          service: {
            teams: [{ teamId }]
          }
        },
        auth: { isAuthenticated: true, credentials: { scope: [] } },
        params: {
          serviceId: 'mock-service-id'
        },
        userIsServiceOwner: userIsServiceOwnerDecorator({
          getUserSession: mockGetUserSession
        })
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

      mockRequest = {
        app: {
          service: {
            teams: [{ teamId: serviceTeamId }]
          }
        },
        auth: { isAuthenticated: true, credentials: { scope: [] } },
        params: {
          serviceId: 'mock-service-id'
        },
        userIsServiceOwner: userIsServiceOwnerDecorator({
          getUserSession: mockGetUserSession
        })
      }
    })

    test('Should not have service owner scope', async () => {
      await addServiceOwnerScope(mockRequest, mockResponseToolkit)

      expect(mockRequest.auth.credentials.scope).toEqual([])
    })
  })
})
