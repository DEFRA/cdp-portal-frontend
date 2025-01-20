import { testSuiteRunResults } from '~/src/server/test-suites/transformers/test-suite-run-results.js'
import { testSuiteRunsFixture } from '~/src/__fixtures__/test-suite-runs.js'

describe('#transformTestSuiteRunResults', () => {
  describe('When a user can NOT run the tests', () => {
    test('Should provide expected test suite run transformation without action buttons', () => {
      expect(
        testSuiteRunsFixture.map((t) => testSuiteRunResults(t, false))
      ).toEqual([
        {
          cells: [
            {
              entity: {
                kind: 'link',
                newWindow: true,
                url: 'https://github.com/DEFRA/cdp-portal-smoke-tests/releases/tag/0.2.0',
                value: '0.2.0'
              },
              headers: 'version'
            },
            {
              entity: {
                kind: 'text',
                value: 'Infra Dev'
              },
              headers: 'environment'
            },
            {
              entity: {
                classes: 'govuk-tag--light-blue',
                kind: 'tag',
                showLoader: true,
                value: 'In-progress'
              },
              headers: 'status'
            },
            {
              entity: {
                kind: 'link',
                newWindow: true,
                url: "https://logs.infra-dev.cdp-int.defra.cloud/_dashboards/app/discover#/?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'2024-02-27T10:29:32.000',to:'2024-02-27T10:31:36.000'))&amp;_a=(columns:!(_source),filters:!(),index:c0abdf20-d49c-11ee-9eac-1d3409bea15a,interval:auto,query:(language:kuery,query:'ecs_task_arn:arn:aws:ecs:eu-west-2:123456789:task%2Finfra-dev-ecs-public%2Ff5cffc31e21149208f38b8ec2b168c50'),sort:!())&_a=(columns:!(log),filters:!(),index:c0abdf20-d49c-11ee-9eac-1d3409bea15a,interval:auto,query:(language:kuery,query:''),sort:!())",
                value: 'logs.infra-dev'
              },
              headers: 'logs'
            },
            {
              classes: 'app-entity-table__cell--owned',
              entity: {
                icon: expect.stringContaining('app-tick-icon'),
                kind: 'link',
                url: '/test-suites/test-results/infra-dev/0.2.0/cdp-portal-smoke-tests/383547d8-f71c-4e7e-8b03-4ddf09fd84fe/index.html',
                value: 'Report'
              },
              headers: 'results',
              isCentered: true
            },
            {
              entity: {
                kind: 'text',
                value: 'B. A. Baracus'
              },
              headers: 'user'
            },
            {
              entity: {
                kind: 'text',
                value: '2 minutes'
              },
              headers: 'duration'
            },
            {
              entity: {
                kind: 'date',
                value: '2024-02-27T10:31:36Z'
              },
              headers: 'last-ran'
            },
            {
              entity: {
                classes: 'app-button--small',
                kind: 'button',
                url: '/test-suites/cdp-portal-smoke-tests/383547d8-f71c-4e7e-8b03-4ddf09fd84fe/stop',
                value: null
              },
              headers: 'action'
            }
          ]
        },
        {
          cells: [
            {
              entity: {
                kind: 'link',
                newWindow: true,
                url: 'https://github.com/DEFRA/cdp-portal-smoke-tests/releases/tag/0.1.0',
                value: '0.1.0'
              },
              headers: 'version'
            },
            {
              entity: {
                kind: 'text',
                value: 'Infra Dev'
              },
              headers: 'environment'
            },
            {
              entity: {
                classes: 'govuk-tag--green',
                kind: 'tag',
                showLoader: false,
                value: 'Finished'
              },
              headers: 'status'
            },
            {
              entity: {
                kind: 'link',
                newWindow: true,
                url: "https://logs.infra-dev.cdp-int.defra.cloud/_dashboards/app/discover#/?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'2024-02-26T16:38:28.000',to:'2024-02-26T16:40:34.000'))&amp;_a=(columns:!(_source),filters:!(),index:c0abdf20-d49c-11ee-9eac-1d3409bea15a,interval:auto,query:(language:kuery,query:'ecs_task_arn:arn:aws:ecs:eu-west-2:123456789:task%2Finfra-dev-ecs-public%2F7e4c74aa41e44a0399bef08711563715'),sort:!())&_a=(columns:!(log),filters:!(),index:c0abdf20-d49c-11ee-9eac-1d3409bea15a,interval:auto,query:(language:kuery,query:''),sort:!())",
                value: 'logs.infra-dev'
              },
              headers: 'logs'
            },
            {
              classes: 'app-entity-table__cell--owned',
              entity: {
                icon: expect.stringContaining('app-tick-icon'),
                kind: 'link',
                url: '/test-suites/test-results/infra-dev/0.1.0/cdp-portal-smoke-tests/dc34cdaf-1f51-44cf-8c63-e9b6800d9609/index.html',
                value: 'Report'
              },
              headers: 'results',
              isCentered: true
            },
            {
              entity: {
                kind: 'text',
                value: 'B. A. Baracus'
              },
              headers: 'user'
            },
            {
              entity: {
                kind: 'text',
                value: '2 minutes'
              },
              headers: 'duration'
            },
            {
              entity: {
                kind: 'date',
                value: '2024-02-26T16:40:34Z'
              },
              headers: 'last-ran'
            },
            {
              entity: {
                classes: 'app-button--small',
                kind: 'button',
                url: '/test-suites/cdp-portal-smoke-tests/dc34cdaf-1f51-44cf-8c63-e9b6800d9609/stop',
                value: null
              },
              headers: 'action'
            }
          ]
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
          cells: [
            {
              entity: {
                kind: 'link',
                newWindow: true,
                url: 'https://github.com/DEFRA/cdp-portal-smoke-tests/releases/tag/0.2.0',
                value: '0.2.0'
              },
              headers: 'version'
            },
            {
              entity: {
                kind: 'text',
                value: 'Infra Dev'
              },
              headers: 'environment'
            },
            {
              entity: {
                classes: 'govuk-tag--light-blue',
                kind: 'tag',
                showLoader: true,
                value: 'In-progress'
              },
              headers: 'status'
            },
            {
              entity: {
                kind: 'link',
                newWindow: true,
                url: "https://logs.infra-dev.cdp-int.defra.cloud/_dashboards/app/discover#/?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'2024-02-27T10:29:32.000',to:'2024-02-27T10:31:36.000'))&amp;_a=(columns:!(_source),filters:!(),index:c0abdf20-d49c-11ee-9eac-1d3409bea15a,interval:auto,query:(language:kuery,query:'ecs_task_arn:arn:aws:ecs:eu-west-2:123456789:task%2Finfra-dev-ecs-public%2Ff5cffc31e21149208f38b8ec2b168c50'),sort:!())&_a=(columns:!(log),filters:!(),index:c0abdf20-d49c-11ee-9eac-1d3409bea15a,interval:auto,query:(language:kuery,query:''),sort:!())",
                value: 'logs.infra-dev'
              },
              headers: 'logs'
            },
            {
              classes: 'app-entity-table__cell--owned',
              entity: {
                icon: expect.stringContaining('app-tick-icon'),
                kind: 'link',
                url: '/test-suites/test-results/infra-dev/0.2.0/cdp-portal-smoke-tests/383547d8-f71c-4e7e-8b03-4ddf09fd84fe/index.html',
                value: 'Report'
              },
              headers: 'results',
              isCentered: true
            },
            {
              entity: {
                kind: 'text',
                value: 'B. A. Baracus'
              },
              headers: 'user'
            },
            {
              entity: {
                kind: 'text',
                value: '2 minutes'
              },
              headers: 'duration'
            },
            {
              entity: {
                kind: 'date',
                value: '2024-02-27T10:31:36Z'
              },
              headers: 'last-ran'
            },
            {
              entity: {
                classes: 'app-button--small',
                kind: 'button',
                url: '/test-suites/cdp-portal-smoke-tests/383547d8-f71c-4e7e-8b03-4ddf09fd84fe/stop',
                value: 'Stop'
              },
              headers: 'action'
            }
          ]
        },
        {
          cells: [
            {
              entity: {
                kind: 'link',
                newWindow: true,
                url: 'https://github.com/DEFRA/cdp-portal-smoke-tests/releases/tag/0.1.0',
                value: '0.1.0'
              },
              headers: 'version'
            },
            {
              entity: {
                kind: 'text',
                value: 'Infra Dev'
              },
              headers: 'environment'
            },
            {
              entity: {
                classes: 'govuk-tag--green',
                kind: 'tag',
                showLoader: false,
                value: 'Finished'
              },
              headers: 'status'
            },
            {
              entity: {
                kind: 'link',
                newWindow: true,
                url: "https://logs.infra-dev.cdp-int.defra.cloud/_dashboards/app/discover#/?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'2024-02-26T16:38:28.000',to:'2024-02-26T16:40:34.000'))&amp;_a=(columns:!(_source),filters:!(),index:c0abdf20-d49c-11ee-9eac-1d3409bea15a,interval:auto,query:(language:kuery,query:'ecs_task_arn:arn:aws:ecs:eu-west-2:123456789:task%2Finfra-dev-ecs-public%2F7e4c74aa41e44a0399bef08711563715'),sort:!())&_a=(columns:!(log),filters:!(),index:c0abdf20-d49c-11ee-9eac-1d3409bea15a,interval:auto,query:(language:kuery,query:''),sort:!())",
                value: 'logs.infra-dev'
              },
              headers: 'logs'
            },
            {
              classes: 'app-entity-table__cell--owned',
              entity: {
                icon: expect.stringContaining('app-tick-icon'),
                kind: 'link',
                url: '/test-suites/test-results/infra-dev/0.1.0/cdp-portal-smoke-tests/dc34cdaf-1f51-44cf-8c63-e9b6800d9609/index.html',
                value: 'Report'
              },
              headers: 'results',
              isCentered: true
            },
            {
              entity: {
                kind: 'text',
                value: 'B. A. Baracus'
              },
              headers: 'user'
            },
            {
              entity: {
                kind: 'text',
                value: '2 minutes'
              },
              headers: 'duration'
            },
            {
              entity: {
                kind: 'date',
                value: '2024-02-26T16:40:34Z'
              },
              headers: 'last-ran'
            },
            {
              entity: {
                classes: 'app-button--small',
                kind: 'button',
                url: '/test-suites/cdp-portal-smoke-tests/dc34cdaf-1f51-44cf-8c63-e9b6800d9609/stop',
                value: null
              },
              headers: 'action'
            }
          ]
        }
      ])
    })
  })
})
