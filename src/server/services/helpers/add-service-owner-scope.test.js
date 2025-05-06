import { addServiceOwnerScope } from '~/src/server/services/helpers/add-service-owner-scope.js'
import { userIsServiceOwnerDecorator } from '~/src/server/common/helpers/user/user-is-service-owner.js'

describe('#addServiceOwnerScope', () => {
  const mockResponseToolkit = { continue: 'mockContinue' }
  let mockGetUserSession
  let mockRequest

  beforeEach(() => {
    mockGetUserSession = jest.fn()
  })

  describe('When un-authenticated and with a service', () => {
    beforeEach(() => {
      const teamId = '9e068bb9-1452-426e-a4ca-2e675a942a89'

      mockRequest = {
        app: {
          entity: {
            teams: [{ teamId }]
          }
        },
        auth: { isAuthenticated: false, credentials: null }
      }
    })

    test('Should not have service owner scope', async () => {
      await addServiceOwnerScope(mockRequest, mockResponseToolkit)

      expect(mockRequest.auth.credentials?.scope).toBeUndefined()
    })
  })

  describe('When un-authenticated and without a service', () => {
    beforeEach(() => {
      mockRequest = {
        app: {},
        auth: { isAuthenticated: false, credentials: null }
      }
    })

    test('Should not have service owner scope', async () => {
      await addServiceOwnerScope(mockRequest, mockResponseToolkit)

      expect(mockRequest.auth.credentials?.scope).toBeUndefined()
    })
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
          entity: {
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
          entity: {
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
