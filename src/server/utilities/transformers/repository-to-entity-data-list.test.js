import { config } from '~/src/config'
import { repositoryToEntityDataList } from '~/src/server/utilities/transformers/repository-to-entity-data-list'
import { repositoryFixture } from '~/src/__fixtures__/repository'

const githubOrg = config.get('githubOrg')

describe('#serviceToEntityDataList', () => {
  test('Should provide expected repository data list entities transformation', () => {
    expect(repositoryToEntityDataList(repositoryFixture.repository)).toEqual([
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
        heading: 'Type'
      },
      {
        entity: {
          kind: 'link',
          newWindow: true,
          url: `https://github.com/${githubOrg}/cdp-portal-frontend`,
          value: `${githubOrg}/cdp-portal-frontend`
        },
        heading: 'Github Repository'
      },
      {
        entity: {
          kind: 'date',
          value: '2023-04-12T17:16:48+00:00'
        },
        heading: 'Repository created'
      }
    ])
  })
})
