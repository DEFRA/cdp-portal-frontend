import { describe, expect, test } from 'vitest'
import { repositoryTestSuiteFixture } from '../../../__fixtures__/repository.js'
import { transformTestSuiteToSummary } from './test-suite-to-summary.js'
import { entityTestSuiteFixture } from '../../../__fixtures__/test-suite.js'

describe('#testSuiteToEntityDataList', () => {
  describe('With a test suite', () => {
    test('Should provide expected test suite summary transformation', () => {
      expect(
        transformTestSuiteToSummary(
          entityTestSuiteFixture,
          repositoryTestSuiteFixture
        )
      ).toEqual(
        expect.objectContaining({
          attributes: {
            'data-testid': 'govuk-summary-list'
          },
          classes: 'app-summary-list',
          rows: [
            {
              key: {
                text: 'Team'
              },
              value: {
                html: expect.stringContaining('Platform')
              }
            },
            {
              key: {
                text: 'Primary Language'
              },
              value: {
                text: 'JavaScript'
              }
            },
            {
              key: {
                text: 'GitHub Repository'
              },
              value: {
                html: expect.stringContaining(
                  'https://github.com/DEFRA/cdp-bc-journey-test-suite'
                )
              }
            },
            {
              key: {
                text: 'Type'
              },
              value: {
                html: expect.stringContaining('Journey')
              }
            },
            {
              key: {
                text: 'Created'
              },
              value: {
                html: expect.stringContaining('Wed 23rd Apr 2025 at 10:14')
              }
            }
          ]
        })
      )
    })
  })
})
