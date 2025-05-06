import { testSuiteFixture } from '~/src/__fixtures__/entity.js'
import { repositoryTestSuiteFixture } from '~/src/__fixtures__/repository.js'
import { transformTestSuiteToSummary } from '~/src/server/test-suites/transformers/test-suite-to-summary.js'

describe('#testSuiteToEntityDataList', () => {
  describe('With a test suite', () => {
    test('Should provide expected test suite summary transformation', () => {
      expect(
        transformTestSuiteToSummary(
          testSuiteFixture,
          repositoryTestSuiteFixture.repository
        )
      ).toEqual({
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
              html: expect.stringContaining('Mon 5th Dec 2016 at 11:21')
            }
          }
        ]
      })
    })
  })
})
