import { provideCanRun } from '~/src/server/test-suites/helpers/pre/provide-can-run'

describe('#provideCanRun', () => {
  let request

  beforeEach(() => {
    request = {
      getUserSession: jest.fn(),
      userIsMemberOfATeam: jest.fn(),
      pre: {
        testSuite: {
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

    const result = await provideCanRun.method(request)

    expect(result).toBe(true)
  })

  test('should return true true if user is authenticated and is a service owner', async () => {
    request.getUserSession.mockResolvedValue({
      isAuthenticated: true,
      isAdmin: false
    })
    request.userIsMemberOfATeam.mockResolvedValue(true)

    const result = await provideCanRun.method(request)

    expect(result).toBe(true)
  })

  test('Should return false if user is authenticated but not an admin or service owner', async () => {
    request.getUserSession.mockResolvedValue({
      isAuthenticated: true,
      isAdmin: false
    })
    request.userIsMemberOfATeam.mockResolvedValue(false)

    const result = await provideCanRun.method(request)

    expect(result).toBe(false)
  })

  test('Should return false if user is not authenticated', async () => {
    request.getUserSession.mockResolvedValue(null)

    const result = await provideCanRun.method(request)

    expect(result).toBe(false)
  })
})
