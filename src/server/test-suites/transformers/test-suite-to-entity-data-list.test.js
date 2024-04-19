import { config } from '~/src/config'
import { testSuiteFixture } from '~/src/__fixtures__/test-suite'
import { testSuiteToEntityDataList } from '~/src/server/test-suites/transformers/test-suite-to-entity-data-list'
import { repositoryDecorator } from '~/src/server/common/helpers/decorators/repository'
import { repositoryFixture } from '~/src/__fixtures__/repository'

const githubOrg = config.get('githubOrg')

describe('#testSuiteToEntityDataList', () => {
  describe('With a deployable service', () => {
    test('Should provide expected service data list entities transformation', () => {
      expect(
        testSuiteToEntityDataList(
          repositoryDecorator(testSuiteFixture, repositoryFixture.repository)
        )
      ).toEqual([
        {
          entity: {
            kind: 'link',
            newWindow: true,
            url: `https://github.com/${githubOrg}/cdp-portal-smoke-tests`,
            value: 'DEFRA/cdp-portal-smoke-tests'
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
            kind: 'text',
            value: 'JavaScript'
          },
          heading: 'Language'
        },
        {
          entity: {
            kind: 'group',
            value: [
              {
                classes: 'app-tag--lowercase',
                kind: 'tag',
                link: {
                  classes: 'app-link-without-underline'
                },
                newWindow: true,
                url: 'https://github.com/search?q=topic%3Acdp+org%3ADEFRA+topic%3Afrontend&type=repositories',
                value: 'frontend'
              },
              {
                classes: 'app-tag--lowercase',
                kind: 'tag',
                link: {
                  classes: 'app-link-without-underline'
                },
                newWindow: true,
                url: 'https://github.com/search?q=topic%3Acdp+org%3ADEFRA+topic%3Anode&type=repositories',
                value: 'node'
              },
              {
                classes: 'app-tag--lowercase',
                kind: 'tag',
                link: {
                  classes: 'app-link-without-underline'
                },
                newWindow: true,
                url: 'https://github.com/search?q=topic%3Acdp+org%3ADEFRA+topic%3Acdp&type=repositories',
                value: 'cdp'
              },
              {
                classes: 'app-tag--lowercase',
                kind: 'tag',
                link: {
                  classes: 'app-link-without-underline'
                },
                newWindow: true,
                url: 'https://github.com/search?q=topic%3Acdp+org%3ADEFRA+topic%3Aservice&type=repositories',
                value: 'service'
              }
            ]
          },
          heading: 'Topics'
        },
        {
          entity: {
            kind: 'date',
            value: '2023-04-12T17:16:48+00:00'
          },
          heading: 'Repository Created'
        }
      ])
    })
  })
})
