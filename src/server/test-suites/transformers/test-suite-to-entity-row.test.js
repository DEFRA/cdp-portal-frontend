import { config } from '~/src/config/index.js'
import { testSuiteWithLastRunFixture } from '~/src/__fixtures__/test-suite.js'
import { transformTestSuiteToEntityRow } from '~/src/server/test-suites/transformers/test-suite-to-entity-row.js'

const githubOrg = config.get('githubOrg')

describe('#transformServiceToEntityRow', () => {
  test('Should provide expected service entity row transformation', () => {
    expect(transformTestSuiteToEntityRow(testSuiteWithLastRunFixture)).toEqual([
      {
        kind: 'link',
        url: '/test-suites/cdp-portal-smoke-tests',
        value: 'cdp-portal-smoke-tests'
      },
      {
        kind: 'group',
        value: [
          {
            kind: 'link',
            url: '/teams/aabe63e7-87ef-4beb-a596-c810631fc474',
            value: 'Platform'
          }
        ]
      },
      {
        kind: 'text',
        value: 'Smoke'
      },
      {
        kind: 'link',
        newWindow: true,
        url: `https://github.com/${githubOrg}/cdp-portal-smoke-tests`,
        value: `${githubOrg}/cdp-portal-smoke-tests`
      },
      {
        kind: 'date',
        value: '2023-04-12T17:18:48Z'
      }
    ])
  })
})
