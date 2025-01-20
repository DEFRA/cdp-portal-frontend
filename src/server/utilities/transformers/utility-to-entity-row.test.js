import { utilityToEntityRow } from '~/src/server/utilities/transformers/utility-to-entity-row.js'
import { templatesFixture } from '~/src/__fixtures__/templates.js'

describe('#utilityToEntityRow', () => {
  describe('When authenticated', () => {
    test('Should provide expected "templates" transformation', () => {
      expect(
        utilityToEntityRow(
          'templates',
          true
        )(templatesFixture.repositories.at(0))
      ).toEqual({
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
            entity: {
              kind: 'link',
              url: '/utilities/templates/cdp-dotnet-backend-template',
              value: 'cdp-dotnet-backend-template'
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
            headers: 'service'
          },
          {
            entity: {
              kind: 'text',
              value: 'C#'
            },
            headers: 'service'
          },
          {
            entity: {
              kind: 'link',
              newWindow: true,
              url: 'https://github.com/DEFRA/cdp-dotnet-backend-template',
              value: 'DEFRA/cdp-dotnet-backend-template'
            },
            headers: 'service'
          },
          {
            entity: {
              kind: 'date',
              value: '2023-08-24T07:08:56+00:00'
            },
            headers: 'service'
          }
        ]
      })
    })
  })

  describe('When not authenticated', () => {
    test('Should provide expected "templates" transformation', () => {
      expect(
        utilityToEntityRow(
          'templates',
          false
        )(templatesFixture.repositories.at(0))
      ).toEqual({
        cells: [
          {
            entity: {
              kind: 'link',
              url: '/utilities/templates/cdp-dotnet-backend-template',
              value: 'cdp-dotnet-backend-template'
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
            headers: 'service'
          },
          {
            entity: {
              kind: 'text',
              value: 'C#'
            },
            headers: 'service'
          },
          {
            entity: {
              kind: 'link',
              newWindow: true,
              url: 'https://github.com/DEFRA/cdp-dotnet-backend-template',
              value: 'DEFRA/cdp-dotnet-backend-template'
            },
            headers: 'service'
          },
          {
            entity: {
              kind: 'date',
              value: '2023-08-24T07:08:56+00:00'
            },
            headers: 'service'
          }
        ]
      })
    })
  })
})
