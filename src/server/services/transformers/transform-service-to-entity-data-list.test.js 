import { transformServiceToEntityDataList } from '~/src/server/services/transformers/transform-service-to-entity-data-list'
import { serviceDetailFixture } from '~/src/__fixtures__/service-detail'

describe('#transformServiceToEntityDataList', () => {
  test('Should provide expected service data list entities transformation', () => {
    expect(transformServiceToEntityDataList(serviceDetailFixture)).toEqual([
      {
        entity: {
          kind: 'link',
          url: '/cdp-portal-frontend/teams/fisheries',
          value: 'Fisheries'
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
        heading: 'Github Repository',
        html: '<a class="app-link" href="https://github.com/defra-cdp-sandpit/cdp-deployables" target="_blank">https://github.com/defra-cdp-sandpit/cdp-deployables</a>'
      },
      {
        heading: 'ECR Docker Image name',
        text: 'cdp-portal-deployables-backend'
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
