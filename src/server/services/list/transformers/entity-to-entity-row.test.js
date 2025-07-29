import { entityToEntityRow } from './entity-to-entity-row.js'
import { entityServicesFixture } from '../../../../__fixtures__/services/entities.js'

describe('#serviceToEntityRow', () => {
  test('Should provide expected entity row transformation', () => {
    expect(entityToEntityRow(entityServicesFixture.at(0))).toEqual({
      cells: [
        {
          classes: 'app-entity-table__cell--owned',
          entity: {
            kind: 'html',
            value: ''
          },
          headers: 'owner',
          isCentered: true
        },
        {
          headers: 'service',
          html: expect.stringContaining('cdp-portal-backend')
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
          headers: 'kind',
          html: '<strong class="govuk-!-margin-right-1">Microservice</strong> Backend'
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
