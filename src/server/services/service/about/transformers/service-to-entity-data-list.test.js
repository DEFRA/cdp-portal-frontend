import { config } from '~/src/config/config.js'
import { serviceToEntityDataList } from '~/src/server/services/service/about/transformers/service-to-entity-data-list.js'
import { serviceDetailFixture } from '~/src/__fixtures__/services/service-detail.js'
import { repositoryDecorator } from '~/src/server/common/helpers/decorators/repository.js'
import { repositoryFixture } from '~/src/__fixtures__/repository.js'
import { createServiceStatusToService } from '~/src/server/common/transformers/create-service-status-to-service.js'
import { createServiceStatusInProgressFixture } from '~/src/__fixtures__/create/service-status-in-progress.js'

const githubOrg = config.get('githubOrg')

describe('#serviceToEntityDataList', () => {
  describe('With a deployable service', () => {
    test('Should provide expected service data list entities transformation', () => {
      expect(serviceToEntityDataList(serviceDetailFixture)).toEqual([
        {
          entity: {
            kind: 'link',
            newWindow: true,
            url: `https://github.com/${githubOrg}/cdp-deployables`,
            value: `${githubOrg}/cdp-deployables`
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
                url: '/teams/087d4a80-002b-48cf-a7d3-aa60b67784f0',
                value: 'Fish-and-octopus'
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
            value: 'C#'
          },
          heading: {
            text: 'Language'
          }
        },
        {
          entity: {
            kind: 'link',
            newWindow: true,
            url: 'https://hub.docker.com/r/defradigital/cdp-portal-deployables-backend/tags',
            value: 'defradigital/cdp-portal-deployables-backend/tags'
          },
          heading: {
            text: 'Docker Hub'
          }
        },
        {
          entity: {
            kind: 'date',
            value: '2023-04-05T08:56:52Z'
          },
          heading: {
            text: 'Repository Created'
          }
        }
      ])
    })
  })

  describe('With an in progress service status', () => {
    test('Should provide expected service data list entities transformation', () => {
      const service = repositoryDecorator(
        createServiceStatusToService(createServiceStatusInProgressFixture),
        repositoryFixture.repository
      )

      expect(serviceToEntityDataList(service)).toEqual([
        {
          entity: {
            kind: 'link',
            newWindow: true,
            url: 'https://github.com/DEFRA/cdp-portal-frontend',
            value: 'DEFRA/cdp-portal-frontend'
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
            text: 'Topics',
            classes: 'govuk-!-margin-bottom-1'
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
