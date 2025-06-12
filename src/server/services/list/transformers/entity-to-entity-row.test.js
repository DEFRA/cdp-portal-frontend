import { entityToEntityRow } from '~/src/server/services/list/transformers/entity-to-entity-row.js'
import { entityServicesFixture } from '~/src/__fixtures__/services/entities.js'

describe('#serviceToEntityRow', () => {
  test('Should provide expected entity row transformation', () => {
    expect(entityToEntityRow(entityServicesFixture.at(0))).toEqual({
      cells: [
        {
          entity: {
            kind: 'html',
            value: ''
          },
          headers: 'owner',
          isCentered: true,
          classes: 'app-entity-table__cell--owned'
        },
        {
          entity: {
            kind: 'link',
            url: '/services/cdp-portal-backend',
            value: 'cdp-portal-backend'
          },
          headers: 'service'
        },
        {
          entity: {
            kind: 'group',
            blank: true,
            value: []
          },
          headers: 'tags'
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
          headers: 'team'
        },
        {
          entity: {
            classes: 'govuk-tag--blue',
            kind: 'tag',
            value: 'Backend'
          },
          headers: 'kind'
        },
        {
          entity: {
            kind: 'link',
            url: 'https://github.com/DEFRA/cdp-portal-backend',
            value: 'https://github.com/DEFRA/cdp-portal-backend'
          },
          headers: 'github-url'
        },
        {
          entity: {
            kind: 'date',
            value: '2016-12-05T11:21:25Z'
          },
          headers: 'created'
        }
      ]
    })
  })
})
