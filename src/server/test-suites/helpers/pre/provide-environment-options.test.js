import { provideEnvironmentOptions } from '~/src/server/test-suites/helpers/pre/provide-environment-options'

const mockRequest = (auth) => ({
  getUserSession: async () => auth
})

describe('#provideEnvironmentOptions', () => {
  test('Should provide admin environments', async () => {
    expect(
      await provideEnvironmentOptions.method(
        mockRequest({
          isAuthenticated: true,
          isAdmin: true
        })
      )
    ).toEqual([
      {
        attributes: { selected: true },
        disabled: true,
        text: ' - - select - - ',
        value: ''
      },
      { text: 'management', value: 'management' },
      { text: 'infra-dev', value: 'infra-dev' },
      { text: 'dev', value: 'dev' },
      { text: 'test', value: 'test' },
      { text: 'perf-test', value: 'perf-test' },
      { text: 'prod', value: 'prod' }
    ])
  })

  test('Should provide "user in service team" environments', async () => {
    expect(
      await provideEnvironmentOptions.method(
        mockRequest({
          isAuthenticated: true,
          isAdmin: false,
          isInServiceTeam: true
        })
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
