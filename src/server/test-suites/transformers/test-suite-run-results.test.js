import { testSuiteRunResults } from './test-suite-run-results.js'
import { testSuiteRunsFixture } from '../../../__fixtures__/test-suite-runs.js'

describe('#transformTestSuiteRunResults', () => {
  describe('When a user can NOT run the tests', () => {
    test('Should provide expected test suite run transformation without action buttons', () => {
      expect(
        testSuiteRunsFixture.map((t) => testSuiteRunResults(t, false))
      ).toEqual([
        {
          runId: '383547d8-f71c-4e7e-8b03-4ddf09fd84fe',
          testSuite: 'cdp-portal-smoke-tests',
          environment: 'Infra Dev',
          version: '0.2.0',
          cpu: '4 vCPU',
          memory: '8 GB',
          profile: undefined,
          status: {
            value: 'In-progress',
            classes: 'govuk-tag--light-blue',
            showLoader: true
          },
          logs: {
            available: true,
            value: 'https://logs.infra-dev.cdp-int.defra.cloud',
            url: "https://logs.infra-dev.cdp-int.defra.cloud/_dashboards/app/dashboards#/view/cdp-portal-smoke-tests?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'2024-02-27T10:29:32.000',to:'2024-02-27T10:31:36.000'))"
          },
          hasResult: true,
          resultUrl:
            '/test-suites/test-results/infra-dev/0.2.0/cdp-portal-smoke-tests/383547d8-f71c-4e7e-8b03-4ddf09fd84fe/index.html',
          runTestStatus: 'passed',
          runTaskStatus: 'in-progress',
          user: 'B. A. Baracus',
          duration: '2 minutes',
          lastRun: '2024-02-27T10:31:36Z',
          stopAction: {
            available: false,
            url: `/test-suites/cdp-portal-smoke-tests/383547d8-f71c-4e7e-8b03-4ddf09fd84fe/stop`
          }
        },
        {
          runId: 'dc34cdaf-1f51-44cf-8c63-e9b6800d9609',
          testSuite: 'cdp-portal-smoke-tests',
          environment: 'Infra Dev',
          version: '0.1.0',
          cpu: '8 vCPU',
          memory: '16 GB',
          profile: undefined,
          status: {
            value: 'Finished',
            classes: 'govuk-tag--green',
            showLoader: false
          },
          logs: {
            available: true,
            value: 'https://logs.infra-dev.cdp-int.defra.cloud',
            url: "https://logs.infra-dev.cdp-int.defra.cloud/_dashboards/app/dashboards#/view/cdp-portal-smoke-tests?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'2024-02-26T16:38:28.000',to:'2024-02-26T16:40:34.000'))"
          },
          hasResult: true,
          resultUrl:
            '/test-suites/test-results/infra-dev/0.1.0/cdp-portal-smoke-tests/dc34cdaf-1f51-44cf-8c63-e9b6800d9609/index.html',
          runTestStatus: 'passed',
          runTaskStatus: 'finished',
          user: 'B. A. Baracus',
          duration: '2 minutes',
          lastRun: '2024-02-26T16:40:34Z',
          stopAction: {
            available: false,
            url: `/test-suites/cdp-portal-smoke-tests/dc34cdaf-1f51-44cf-8c63-e9b6800d9609/stop`
          }
        }
      ])
    })
  })

  describe('When a user can run the tests', () => {
    test('Should provide expected test suite run transformation with action buttons', () => {
      expect(
        testSuiteRunsFixture.map((t) => testSuiteRunResults(t, true))
      ).toEqual([
        {
          runId: '383547d8-f71c-4e7e-8b03-4ddf09fd84fe',
          testSuite: 'cdp-portal-smoke-tests',
          environment: 'Infra Dev',
          version: '0.2.0',
          cpu: '4 vCPU',
          memory: '8 GB',
          profile: undefined,
          status: {
            value: 'In-progress',
            classes: 'govuk-tag--light-blue',
            showLoader: true
          },
          logs: {
            available: true,
            value: 'https://logs.infra-dev.cdp-int.defra.cloud',
            url: "https://logs.infra-dev.cdp-int.defra.cloud/_dashboards/app/dashboards#/view/cdp-portal-smoke-tests?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'2024-02-27T10:29:32.000',to:'2024-02-27T10:31:36.000'))"
          },
          hasResult: true,
          resultUrl:
            '/test-suites/test-results/infra-dev/0.2.0/cdp-portal-smoke-tests/383547d8-f71c-4e7e-8b03-4ddf09fd84fe/index.html',
          runTestStatus: 'passed',
          runTaskStatus: 'in-progress',
          user: 'B. A. Baracus',
          duration: '2 minutes',
          lastRun: '2024-02-27T10:31:36Z',
          stopAction: {
            available: true,
            url: `/test-suites/cdp-portal-smoke-tests/383547d8-f71c-4e7e-8b03-4ddf09fd84fe/stop`
          }
        },
        {
          runId: 'dc34cdaf-1f51-44cf-8c63-e9b6800d9609',
          testSuite: 'cdp-portal-smoke-tests',
          environment: 'Infra Dev',
          version: '0.1.0',
          cpu: '8 vCPU',
          memory: '16 GB',
          profile: undefined,
          status: {
            value: 'Finished',
            classes: 'govuk-tag--green',
            showLoader: false
          },
          logs: {
            available: true,
            value: 'https://logs.infra-dev.cdp-int.defra.cloud',
            url: "https://logs.infra-dev.cdp-int.defra.cloud/_dashboards/app/dashboards#/view/cdp-portal-smoke-tests?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'2024-02-26T16:38:28.000',to:'2024-02-26T16:40:34.000'))"
          },
          hasResult: true,
          resultUrl:
            '/test-suites/test-results/infra-dev/0.1.0/cdp-portal-smoke-tests/dc34cdaf-1f51-44cf-8c63-e9b6800d9609/index.html',
          runTestStatus: 'passed',
          runTaskStatus: 'finished',
          user: 'B. A. Baracus',
          duration: '2 minutes',
          lastRun: '2024-02-26T16:40:34Z',
          stopAction: {
            available: false,
            url: `/test-suites/cdp-portal-smoke-tests/dc34cdaf-1f51-44cf-8c63-e9b6800d9609/stop`
          }
        }
      ])
    })
  })
})
