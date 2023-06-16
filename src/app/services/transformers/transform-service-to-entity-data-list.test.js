import { transformServiceToEntityDataList } from '~/src/app/services/transformers/transform-service-to-entity-data-list'
import { serviceFixture } from '~/src/__fixtures__/service'

describe('#transformServiceToEntityDataList', () => {
  test('Should provide expected service data list entities transformation', () => {
    expect(transformServiceToEntityDataList(serviceFixture)).toEqual([
      {
        entity: {
          kind: 'link',
          url: '/cdp-portal-frontend/teams/forestry-management',
          value: 'forestry-management'
        },
        heading: 'Team'
      },
      {
        entity: {
          kind: 'text',
          value: 'Java Script'
        },
        heading: 'Type'
      },
      {
        heading: 'GitHub Repository',
        html: '<a class="app-link" href="https://github.com/defra-cdp-sandpit/cdp-portal-frontend" target="_blank">defra-cdp-sandpit/cdp-portal-frontend</a>'
      },
      {
        heading: 'ECR Docker Image name',
        text: 'cdp-portal-frontend'
      },
      {
        entity: {
          kind: 'date',
          value: '2023-04-12T17:16:48Z'
        },
        heading: 'Repository created'
      }
    ])
  })
})
