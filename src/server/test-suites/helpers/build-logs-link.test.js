import { buildLogsLink } from './build-logs-link.js'

describe('#buildLogsLink', () => {
  beforeAll(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2023-04-01'))
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  describe('Whilst tests are running', () => {
    test('Should provide expected link', () => {
      expect(
        buildLogsLink(
          {
            testSuite: 'test-suite-name',
            environment: 'infra-dev',
            created: '2024-02-26T16:38:28.979Z',
            taskLastUpdated: '2024-02-26T16:40:34.000Z'
          },
          false
        )
      ).toBe(
        "https://logs.infra-dev.cdp-int.defra.cloud/_dashboards/app/dashboards#/view/test-suite-name?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'2024-02-26T16:38:28.000',to:'now'))"
      )
    })
  })

  describe('When tests have finished', () => {
    test('Should provide expected link', () => {
      expect(
        buildLogsLink(
          {
            testSuite: 'test-suite-name',
            environment: 'infra-dev',
            created: '2024-02-26T16:38:28.979Z',
            taskLastUpdated: '2024-02-26T16:40:34.000Z'
          },
          true
        )
      ).toBe(
        "https://logs.infra-dev.cdp-int.defra.cloud/_dashboards/app/dashboards#/view/test-suite-name?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'2024-02-26T16:38:28.000',to:'2024-02-26T16:40:34.000'))"
      )
    })
  })
})
