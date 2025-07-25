import { describe, expect, test } from 'vitest'
import { entityTestSuiteFixture } from '../../../__fixtures__/test-suite.js'
import { testSuiteToEntityRow } from './test-suite-to-entity-row.js'

describe('#transformTestSuiteToEntityRow', () => {
  test('Should provide expected entity row transformation', () => {
    expect(testSuiteToEntityRow(entityTestSuiteFixture)).toEqual({
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
            url: '/test-suites/jrny-test-suite-1745403279072',
            value: 'jrny-test-suite-1745403279072'
          },
          headers: 'test-suite'
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
            kind: 'text',
            value: 'Journey'
          },
          headers: 'kind'
        },
        {
          entity: {
            kind: 'date',
            value: '2025-04-23T10:14:49.589Z'
          },
          headers: 'created'
        }
      ]
    })
  })
})
