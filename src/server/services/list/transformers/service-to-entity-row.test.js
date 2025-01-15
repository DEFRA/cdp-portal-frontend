import { serviceToEntityRow } from '~/src/server/services/list/transformers/service-to-entity-row.js'
import { servicesWithRepositoriesFixture } from '~/src/__fixtures__/services/services-with-repositories.js'

describe('#serviceToEntityRow', () => {
  describe('When authenticated', () => {
    test('Should provide expected service entity row transformation', () => {
      expect(
        serviceToEntityRow(true)(servicesWithRepositoriesFixture.at(0))
      ).toEqual({
        cells: [
          {
            entity: {
              kind: 'html',
              value: ''
            },
            headers: 'owner'
          },
          {
            entity: {
              kind: 'link',
              url: '/services/cdp-portal-frontend',
              value: 'cdp-portal-frontend'
            },
            headers: 'service'
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
            headers: 'team'
          },
          {
            entity: {
              kind: 'text',
              value: '- - -'
            },
            headers: 'kind'
          },
          {
            entity: {
              kind: 'text',
              value: 'JavaScript'
            },
            headers: 'language'
          },
          {
            entity: {
              kind: 'link',
              newWindow: true,
              url: 'https://github.com/DEFRA/cdp-portal-frontend',
              value: 'DEFRA/cdp-portal-frontend'
            },
            headers: 'github-repository'
          },
          {
            entity: {
              kind: 'date',
              value: '2023-04-12T17:16:48Z'
            },
            headers: 'created'
          }
        ]
      })
    })
  })

  describe('When un-authenticated', () => {
    test('Should provide expected service entity row transformation', () => {
      expect(
        serviceToEntityRow(false)(servicesWithRepositoriesFixture.at(0))
      ).toEqual({
        cells: [
          {
            entity: {
              kind: 'link',
              url: '/services/cdp-portal-frontend',
              value: 'cdp-portal-frontend'
            },
            headers: 'service'
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
            headers: 'team'
          },
          {
            entity: {
              kind: 'text',
              value: '- - -'
            },
            headers: 'kind'
          },
          {
            entity: {
              kind: 'text',
              value: 'JavaScript'
            },
            headers: 'language'
          },
          {
            entity: {
              kind: 'link',
              newWindow: true,
              url: 'https://github.com/DEFRA/cdp-portal-frontend',
              value: 'DEFRA/cdp-portal-frontend'
            },
            headers: 'github-repository'
          },
          {
            entity: {
              kind: 'date',
              value: '2023-04-12T17:16:48Z'
            },
            headers: 'created'
          }
        ]
      })
    })
  })
})
