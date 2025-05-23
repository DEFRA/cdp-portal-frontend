import { config } from '~/src/config/config.js'
import { testSuiteFixture } from '~/src/__fixtures__/test-suite.js'
import { testSuiteToEntityDataList } from '~/src/server/test-suites/transformers/test-suite-to-entity-data-list.js'
import { repositoryDecorator } from '~/src/server/common/helpers/decorators/repository.js'
import { repositoryFixture } from '~/src/__fixtures__/repository.js'

const githubOrg = config.get('githubOrg')

describe('#testSuiteToEntityDataList', () => {
  describe('With a deployable service', () => {
    test('Should provide expected service data list entities transformation', () => {
      expect(
        testSuiteToEntityDataList(
          repositoryDecorator(testSuiteFixture, repositoryFixture)
        )
      ).toEqual([
        {
          entity: {
            kind: 'link',
            newWindow: true,
            url: `https://github.com/${githubOrg}/cdp-portal-smoke-tests`,
            value: 'DEFRA/cdp-portal-smoke-tests'
          },
          heading: {
            text: 'GitHub Repository'
          }
        },
        {
          entity: {
            kind: 'group',
            value: [
              {
                kind: 'link',
                url: '/teams/aabe63e7-87ef-4beb-a596-c810631fc474',
                value: 'Platform'
              }
            ]
          },
          heading: {
            text: 'Team'
          }
        },
        {
          entity: {
            kind: 'text',
            value: 'JavaScript'
          },
          heading: {
            text: 'Language'
          }
        },
        {
          entity: {
            kind: 'group',
            value: [
              {
                kind: 'tag',
                link: {
                  classes: 'app-link--without-underline'
                },
                newWindow: true,
                url: 'https://github.com/search?q=topic%3Acdp+org%3ADEFRA+topic%3Afrontend&type=repositories',
                value: 'frontend'
              },
              {
                kind: 'tag',
                link: {
                  classes: 'app-link--without-underline'
                },
                newWindow: true,
                url: 'https://github.com/search?q=topic%3Acdp+org%3ADEFRA+topic%3Anode&type=repositories',
                value: 'node'
              },
              {
                kind: 'tag',
                link: {
                  classes: 'app-link--without-underline'
                },
                newWindow: true,
                url: 'https://github.com/search?q=topic%3Acdp+org%3ADEFRA+topic%3Acdp&type=repositories',
                value: 'cdp'
              },
              {
                kind: 'tag',
                link: {
                  classes: 'app-link--without-underline'
                },
                newWindow: true,
                url: 'https://github.com/search?q=topic%3Acdp+org%3ADEFRA+topic%3Aservice&type=repositories',
                value: 'service'
              }
            ]
          },
          heading: {
            text: 'Topics'
          }
        },
        {
          entity: {
            kind: 'date',
            value: '2023-04-12T17:16:48+00:00'
          },
          heading: {
            text: 'Repository Created'
          }
        }
      ])
    })
  })
})
