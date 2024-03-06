import { config } from '~/src/config'
import { testSuiteFixture } from '~/src/__fixtures__/test-suite'
import { testSuiteToEntityDataList } from '~/src/server/test-suites/transformers/test-suite-to-entity-data-list'

const githubOrg = config.get('githubOrg')

describe('#testSuiteToEntityDataList', () => {
  describe('With a deployable service', () => {
    test('Should provide expected service data list entities transformation', () => {
      expect(testSuiteToEntityDataList(testSuiteFixture)).toEqual([
        {
          entity: {
            kind: 'link',
            newWindow: true,
            url: `https://github.com/${githubOrg}/cdp-portal-smoke-tests`,
            value: `${githubOrg}/cdp-portal-smoke-tests`
          },
          heading: 'GitHub Repository'
        },
        {
          entity: {
            kind: 'list',
            value: [
              {
                kind: 'link',
                url: '/teams/aabe63e7-87ef-4beb-a596-c810631fc474',
                value: 'Platform'
              }
            ]
          },
          heading: 'Team'
        },
        {
          entity: {
            kind: 'date'
          },
          heading: 'Repository Created'
        }
      ])
    })
  })
})
