import { provideEnvironmentOptions } from '~/src/server/test-suites/helpers/pre/provide-environment-options'

const mockRequest = (auth, pre = {}, isMemberOfATeam = false) => ({
  pre,
  getUserSession: () => auth,
  userIsMemberOfATeam: () => isMemberOfATeam
})

describe('#provideEnvironmentOptions', () => {
  test('Should provide admin environments for perf tests', async () => {
    expect(
      await provideEnvironmentOptions.method(
        mockRequest(
          {
            isAuthenticated: true,
            isAdmin: true
          },
          {
            testSuite: {
              serviceName: 'perf-test-suite',
              topics: ['test', 'cdp', 'performance']
            }
          }
        )
      )
    ).toEqual([
      {
        attributes: { selected: true },
        disabled: true,
        text: ' - - select - - ',
        value: ''
      },
      { text: 'perf-test', value: 'perf-test' },
      { text: 'management', value: 'management' },
      { text: 'infra-dev', value: 'infra-dev' }
    ])
  })

  test('Should provide smoke test environments for non-admins', async () => {
    expect(
      await provideEnvironmentOptions.method(
        mockRequest(
          {
            isAuthenticated: true,
            isAdmin: false
          },
          {
            testSuite: {
              teams: [
                {
                  teamId: 'mock-team-id'
                }
              ],
              topics: ['smoke']
            }
          },
          true
        )
      )
    ).toEqual([
      {
        attributes: { selected: true },
        disabled: true,
        text: ' - - select - - ',
        value: ''
      },
      { text: 'dev', value: 'dev' },
      { text: 'test', value: 'test' },
      { text: 'perf-test', value: 'perf-test' },
      { text: 'prod', value: 'prod' }
    ])
  })

  test('Should provide perf test environments for non-admins', async () => {
    expect(
      await provideEnvironmentOptions.method(
        mockRequest(
          {
            isAuthenticated: true,
            isAdmin: false
          },
          {
            testSuite: {
              teams: [
                {
                  teamId: 'mock-team-id'
                }
              ],
              topics: ['performance']
            }
          },
          true
        )
      )
    ).toEqual([
      {
        attributes: { selected: true },
        disabled: true,
        text: ' - - select - - ',
        value: ''
      },
      { text: 'perf-test', value: 'perf-test' }
    ])
  })

  test('Should provide environments test environments for non-admins', async () => {
    expect(
      await provideEnvironmentOptions.method(
        mockRequest(
          {
            isAuthenticated: true,
            isAdmin: false
          },
          {
            testSuite: {
              teams: [
                {
                  teamId: 'mock-team-id'
                }
              ],
              topics: ['environment']
            }
          },
          true
        )
      )
    ).toEqual([
      {
        attributes: { selected: true },
        disabled: true,
        text: ' - - select - - ',
        value: ''
      },
      { text: 'dev', value: 'dev' },
      { text: 'test', value: 'test' }
    ])
  })

  test('Should provide no environments for incorrectly tagged test suite', async () => {
    expect(
      await provideEnvironmentOptions.method(
        mockRequest(
          {
            isAuthenticated: true,
            isAdmin: false
          },
          {
            testSuite: {
              teams: [
                {
                  teamId: 'mock-team-id'
                }
              ],
              topics: ['wrong-topic', 'not-a-test-suite']
            }
          },
          true
        )
      )
    ).toEqual([
      {
        attributes: { selected: true },
        disabled: true,
        text: ' - - select - - ',
        value: ''
      }
    ])
  })

  test('Should provide un-authenticated environments', async () => {
    expect(
      await provideEnvironmentOptions.method(
        mockRequest({
          isAuthenticated: false
        })
      )
    ).toEqual([])
  })
})
