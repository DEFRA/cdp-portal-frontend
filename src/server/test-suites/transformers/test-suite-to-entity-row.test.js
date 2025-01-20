import { testSuiteWithLastRunFixture } from '~/src/__fixtures__/test-suite.js'
import { testSuiteToEntityRow } from '~/src/server/test-suites/transformers/test-suite-to-entity-row.js'

describe('#transformServiceToEntityRow', () => {
  describe('When authenticated', () => {
    test('Should provide expected service entity row transformation', () => {
      expect(testSuiteToEntityRow(true)(testSuiteWithLastRunFixture)).toEqual({
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
              url: '/test-suites/cdp-portal-smoke-tests',
              value: 'cdp-portal-smoke-tests'
            },
            headers: 'test-suite'
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
              value: 'Smoke'
            },
            headers: 'kind'
          },
          {
            entity: {
              kind: 'link',
              newWindow: true,
              url: 'https://github.com/DEFRA/cdp-portal-smoke-tests',
              value: 'DEFRA/cdp-portal-smoke-tests'
            },
            headers: 'github-repository'
          },
          {
            entity: {
              kind: 'date',
              value: '2023-04-12T17:18:48Z'
            },
            headers: 'last-ran'
          },
          {
            entity: {
              kind: 'date'
            },
            headers: 'created'
          }
        ]
      })
    })
  })

  describe('When not authenticated', () => {
    test('Should provide expected service entity row transformation', () => {
      expect(testSuiteToEntityRow(false)(testSuiteWithLastRunFixture)).toEqual({
        cells: [
          {
            entity: {
              kind: 'link',
              url: '/test-suites/cdp-portal-smoke-tests',
              value: 'cdp-portal-smoke-tests'
            },
            headers: 'test-suite'
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
              value: 'Smoke'
            },
            headers: 'kind'
          },
          {
            entity: {
              kind: 'link',
              newWindow: true,
              url: 'https://github.com/DEFRA/cdp-portal-smoke-tests',
              value: 'DEFRA/cdp-portal-smoke-tests'
            },
            headers: 'github-repository'
          },
          {
            entity: {
              kind: 'date',
              value: '2023-04-12T17:18:48Z'
            },
            headers: 'last-ran'
          },
          {
            entity: {
              kind: 'date'
            },
            headers: 'created'
          }
        ]
      })
    })
  })
})
