import { config } from '~/src/config'
import { transformServiceToEntityDataList } from '~/src/server/services/transformers/transform-service-to-entity-data-list'
import { serviceDetailFixture } from '~/src/__fixtures__/service-detail'

const githubOrg = config.get('githubOrg')

describe('#transformServiceToEntityDataList', () => {
  test('Should provide expected service data list entities transformation', () => {
    expect(transformServiceToEntityDataList(serviceDetailFixture)).toEqual([
      {
        entity: {
          kind: 'link',
          url: '/cdp-portal-frontend/teams/fisheries',
          value: 'fisheries'
        },
        heading: 'Team'
      },
      {
        entity: {
          kind: 'text',
          value: 'C#'
        },
        heading: 'Type'
      },
      {
        entity: {
          kind: 'link',
          newWindow: true,
          url: `https://github.com/${githubOrg}/cdp-deployables`,
          value: `${githubOrg}/cdp-deployables`
        },
        heading: 'Github Repository'
      },
      {
        entity: {
          kind: 'text',
          value: 'cdp-portal-deployables-backend'
        },
        heading: 'ECR Docker Image name'
      },
      {
        entity: {
          kind: 'date',
          value: '2023-04-05T08:56:52Z'
        },
        heading: 'Repository created'
      }
    ])
  })
})
