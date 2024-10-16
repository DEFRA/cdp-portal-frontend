import { provideIsServiceOwner } from '~/src/server/services/helpers/pre/provide-is-service-owner'

describe('#provideIsServiceOwner', () => {
  let mockRequest

  beforeEach(() => {
    mockRequest = {
      getUserSession: jest.fn(),
      userIsServiceOwner: jest.fn(),
      pre: {
        service: {
          teams: [{ teamId: 'team1' }, { teamId: 'team2' }]
        }
      }
    }
  })

  test('Should return true if user is authenticated and is an admin', async () => {
    mockRequest.getUserSession.mockResolvedValue({
      isAuthenticated: true,
      isAdmin: true
    })

    const result = await provideIsServiceOwner.method(mockRequest)

    expect(result).toBe(true)
  })

  test('Should return true if user is authenticated and is a service owner', async () => {
    mockRequest.getUserSession.mockResolvedValue({
      isAuthenticated: true,
      isAdmin: false
    })
    mockRequest.userIsServiceOwner.mockResolvedValue(true)

    const result = await provideIsServiceOwner.method(mockRequest)

    expect(result).toBe(true)
  })

  test('Should return false if user is authenticated but not an admin or service owner', async () => {
    mockRequest.getUserSession.mockResolvedValue({
      isAuthenticated: true,
      isAdmin: false
    })
    mockRequest.userIsServiceOwner.mockResolvedValue(false)

    const result = await provideIsServiceOwner.method(mockRequest)

    expect(result).toBe(false)
  })

  test('Should return false if user is not authenticated', async () => {
    mockRequest.getUserSession.mockResolvedValue(null)

    const result = await provideIsServiceOwner.method(mockRequest)

    expect(result).toBe(false)
  })
})
