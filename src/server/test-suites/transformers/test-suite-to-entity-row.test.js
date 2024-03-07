import { config } from '~/src/config'
import { servicesWithRepositoriesFixture } from '~/src/__fixtures__/services-with-repositories'
import { transformTestSuiteToEntityRow } from '~/src/server/test-suites/transformers/test-suite-to-entity-row'

const githubOrg = config.get('githubOrg')

describe('#transformServiceToEntityRow', () => {
  test('Should provide expected service entity row transformation', () => {
    expect(
      transformTestSuiteToEntityRow(servicesWithRepositoriesFixture.at(0))
    ).toEqual([
      {
        kind: 'link',
        url: '/test-suites/cdp-portal-frontend',
        value: 'cdp-portal-frontend'
      },
      {
        kind: 'list',
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
        value: 'JavaScript'
      },
      {
        kind: 'link',
        newWindow: true,
        url: `https://github.com/${githubOrg}/cdp-portal-frontend`,
        value: 'cdp-portal-frontend'
      },
      {
        kind: 'date',
        value: '2023-04-12T17:16:48Z'
      }
    ])
  })
})
