import { transformTestSuiteRunResults } from '~/src/server/test-suites/transformers/test-suite-run-results'
import { testSuiteRunsFixture } from '~/src/__fixtures__/test-suite-runs'

describe('#transformTestSuiteRunResults', () => {
  test('Should provide expected test suite run transformation without action buttons', () => {
    expect(
      testSuiteRunsFixture.map((t) => transformTestSuiteRunResults(t, false))
    ).toEqual([
      [
        {
          kind: 'link',
          newWindow: true,
          url: 'https://github.com/DEFRA/cdp-portal-smoke-tests/releases/tag/0.2.0',
          value: '0.2.0'
        },
        {
          kind: 'text',
          value: 'Infra Dev'
        },
        {
          classes: 'govuk-tag--light-blue',
          kind: 'tag',
          showLoader: true,
          value: 'in-progress'
        },
        {
          kind: 'link',
          newWindow: true,
          url: "https://logs.infra-dev.cdp-int.defra.cloud/_dashboards/app/discover#/?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'2024-02-27T10:29:32.000',to:'2024-02-27T10:31:36.000'))&amp;_a=(columns:!(_source),filters:!(),index:c0abdf20-d49c-11ee-9eac-1d3409bea15a,interval:auto,query:(language:kuery,query:'ecs_task_arn:arn:aws:ecs:eu-west-2:123456789:task%2Finfra-dev-ecs-public%2Ff5cffc31e21149208f38b8ec2b168c50'),sort:!())&_a=(columns:!(log),filters:!(),index:c0abdf20-d49c-11ee-9eac-1d3409bea15a,interval:auto,query:(language:kuery,query:''),sort:!())",
          value: 'logs.infra-dev'
        },
        {
          icon: '<svg xmlns="http://www.w3.org/2000/svg"\n     class="app-icon app-tick-icon app-icon-small"\n     width="48" height="48" viewBox="0 -960 960 960">\n  <path\n    d="m419-285 291-292-63-64-228 228-111-111-63 64 174 175Zm60.679 226q-86.319 0-163.646-32.604-77.328-32.603-134.577-89.852-57.249-57.249-89.852-134.57Q59-393.346 59-479.862q0-87.41 32.662-164.275 32.663-76.865 90.042-134.438 57.378-57.574 134.411-90.499Q393.147-902 479.336-902q87.55 0 164.839 32.848 77.288 32.849 134.569 90.303 57.281 57.454 90.269 134.523Q902-567.257 902-479.458q0 86.734-32.926 163.544-32.925 76.809-90.499 134.199-57.573 57.39-134.447 90.053Q567.255-59 479.679-59Z"/>\n</svg>\n',
          kind: 'link',
          newWindow: true,
          url: '/test-suites/test-results/infra-dev/cdp-portal-smoke-tests/383547d8-f71c-4e7e-8b03-4ddf09fd84fe',
          value: 'Report'
        },
        {
          kind: 'text',
          value: 'B. A. Baracus'
        },
        {
          kind: 'text',
          value: '2 minutes'
        },
        {
          kind: 'date',
          value: '2024-02-27T10:31:36Z'
        },
        {
          kind: 'text',
          value: ''
        }
      ],
      [
        {
          kind: 'link',
          newWindow: true,
          url: 'https://github.com/DEFRA/cdp-portal-smoke-tests/releases/tag/0.1.0',
          value: '0.1.0'
        },
        {
          kind: 'text',
          value: 'Infra Dev'
        },
        {
          classes: 'govuk-tag--green',
          kind: 'tag',
          showLoader: false,
          value: 'finished'
        },
        {
          kind: 'link',
          newWindow: true,
          url: "https://logs.infra-dev.cdp-int.defra.cloud/_dashboards/app/discover#/?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'2024-02-26T16:38:28.000',to:'2024-02-26T16:40:34.000'))&amp;_a=(columns:!(_source),filters:!(),index:c0abdf20-d49c-11ee-9eac-1d3409bea15a,interval:auto,query:(language:kuery,query:'ecs_task_arn:arn:aws:ecs:eu-west-2:123456789:task%2Finfra-dev-ecs-public%2F7e4c74aa41e44a0399bef08711563715'),sort:!())&_a=(columns:!(log),filters:!(),index:c0abdf20-d49c-11ee-9eac-1d3409bea15a,interval:auto,query:(language:kuery,query:''),sort:!())",
          value: 'logs.infra-dev'
        },
        {
          icon: '<svg xmlns="http://www.w3.org/2000/svg"\n     class="app-icon app-tick-icon app-icon-small"\n     width="48" height="48" viewBox="0 -960 960 960">\n  <path\n    d="m419-285 291-292-63-64-228 228-111-111-63 64 174 175Zm60.679 226q-86.319 0-163.646-32.604-77.328-32.603-134.577-89.852-57.249-57.249-89.852-134.57Q59-393.346 59-479.862q0-87.41 32.662-164.275 32.663-76.865 90.042-134.438 57.378-57.574 134.411-90.499Q393.147-902 479.336-902q87.55 0 164.839 32.848 77.288 32.849 134.569 90.303 57.281 57.454 90.269 134.523Q902-567.257 902-479.458q0 86.734-32.926 163.544-32.925 76.809-90.499 134.199-57.573 57.39-134.447 90.053Q567.255-59 479.679-59Z"/>\n</svg>\n',
          kind: 'link',
          newWindow: true,
          url: '/test-suites/test-results/infra-dev/cdp-portal-smoke-tests/dc34cdaf-1f51-44cf-8c63-e9b6800d9609',
          value: 'Report'
        },
        {
          kind: 'text',
          value: 'B. A. Baracus'
        },
        {
          kind: 'text',
          value: '2 minutes'
        },
        {
          kind: 'date',
          value: '2024-02-26T16:40:34Z'
        },
        {
          kind: 'text',
          value: ''
        }
      ]
    ])
  })

  test('Should provide expected test suite run transformation with action buttons', () => {
    const output = testSuiteRunsFixture.map((t) =>
      transformTestSuiteRunResults(t, true)
    )
    expect(output[0][output[0].length - 1]).toEqual({
      kind: 'button',
      value: 'Stop',
      classes: 'app-button--secondary',
      url: '/test-suites/cdp-portal-smoke-tests/383547d8-f71c-4e7e-8b03-4ddf09fd84fe/stop'
    })

    expect(output[1][output[0].length - 1]).toEqual({ kind: 'text', value: '' })
  })
})
