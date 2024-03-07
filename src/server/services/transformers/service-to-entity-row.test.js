import { serviceToEntityRow } from '~/src/server/services/transformers/service-to-entity-row'
import { servicesWithRepositoriesFixture } from '~/src/__fixtures__/services-with-repositories'

describe('#serviceToEntityRow', () => {
  test('Should provide expected service entity row transformation', () => {
    expect(serviceToEntityRow(servicesWithRepositoriesFixture.at(0))).toEqual([
      {
        kind: 'link',
        url: '/services/cdp-portal-frontend',
        value: 'cdp-portal-frontend'
      },
      {
        kind: 'list',
        value: [
          {
            kind: 'link',
            url: '/teams/aabe63e7-87ef-4beb-a596-c810631fc474',
            value: 'Platform'
          }
        ]
      },
      {
        kind: 'text',
        value: 'JavaScript'
      },
      {
        kind: 'link',
        newWindow: true,
        url: `https://github.com/DEFRA/cdp-portal-frontend`,
        value: 'cdp-portal-frontend'
      },
      {
        kind: 'date',
        value: '2023-04-12T17:16:48Z'
      }
    ])
  })
})
