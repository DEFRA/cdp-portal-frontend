import { transformServiceToEntityRow } from '~/src/server/services/transformers/transform-service-to-entity-row'
import { servicesFixture } from '~/src/__fixtures__/services'

describe('#transformServiceToEntityRow', () => {
  test('Should provide expected service entity row transformation', () => {
    expect(transformServiceToEntityRow(servicesFixture.at(0))).toEqual([
      {
        kind: 'link',
        url: '/cdp-portal-frontend/services/cdp-portal-frontend',
        value: 'cdp-portal-frontend'
      },
      {
        kind: 'link',
        url: '/cdp-portal-frontend/teams/forestry-management',
        value: 'Forestry Management'
      },
      {
        kind: 'text',
        value: 'JavaScript'
      },
      {
        kind: 'link',
        newWindow: true,
        url: 'https://github.com/defra-cdp-sandpit/cdp-portal-frontend',
        value: 'defra-cdp-sandpit/cdp-portal-frontend'
      },
      {
        kind: 'date',
        value: '2023-04-12T17:16:48Z'
      }
    ])
  })
})
