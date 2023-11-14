import { config } from '~/src/config'
import { transformRepositoryToEntityDataList } from '~/src/server/utilities/transformers/transform-repository-to-entity-data-list'
import { serviceGithubDetailFixture } from '~/src/__fixtures__/service-github-detail'

const githubOrg = config.get('githubOrg')

describe('#transformServiceToEntityDataList', () => {
  test('Should provide expected repository data list entities transformation', () => {
    expect(
      transformRepositoryToEntityDataList(serviceGithubDetailFixture.repository)
    ).toEqual([
      {
        entity: {
          kind: 'list',
          value: [
            {
              kind: 'link',
              url: '/cdp-portal-frontend/teams/aabe63e7-87ef-4beb-a596-c810631fc474',
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
