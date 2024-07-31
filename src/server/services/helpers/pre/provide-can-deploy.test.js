import { provideCanDeploy } from '~/src/server/services/helpers/pre/provide-can-deploy'

describe('#provideCanDeploy', () => {
  let request

  beforeEach(() => {
    request = {
      getUserSession: jest.fn(),
      userIsMemberOfATeam: jest.fn(),
      pre: {
        service: {
          teams: [{ teamId: 'team1' }, { teamId: 'team2' }]
        }
      }
    }
  })

  test('Should return true if user is authenticated and is an admin', async () => {
    request.getUserSession.mockResolvedValue({
      isAuthenticated: true,
      isAdmin: true
    })

    const result = await provideCanDeploy.method(request)

    expect(result).toBe(true)
  })

  test('Should return true if user is authenticated and is a service owner', async () => {
    request.getUserSession.mockResolvedValue({
      isAuthenticated: true,
      isAdmin: false
    })
    request.userIsMemberOfATeam.mockResolvedValue(true)

    const result = await provideCanDeploy.method(request)

    expect(result).toBe(true)
  })

  test('Should return false if user is authenticated but not an admin or service owner', async () => {
    request.getUserSession.mockResolvedValue({
      isAuthenticated: true,
      isAdmin: false
    })
    request.userIsMemberOfATeam.mockResolvedValue(false)

    const result = await provideCanDeploy.method(request)

    expect(result).toBe(false)
  })

  test('Should return false if user is not authenticated', async () => {
    request.getUserSession.mockResolvedValue(null)

    const result = await provideCanDeploy.method(request)

    expect(result).toBe(false)
  })
})
