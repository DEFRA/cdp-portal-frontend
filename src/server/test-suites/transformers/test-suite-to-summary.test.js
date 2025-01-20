import { testSuiteFixture } from '~/src/__fixtures__/test-suite.js'
import { repositoryDecorator } from '~/src/server/common/helpers/decorators/repository.js'
import { repositoryFixture } from '~/src/__fixtures__/repository.js'
import { transformTestSuiteToSummary } from '~/src/server/test-suites/transformers/test-suite-to-summary.js'

describe('#testSuiteToEntityDataList', () => {
  describe('With a test suite', () => {
    test('Should provide expected test suite summary transformation', () => {
      expect(
        transformTestSuiteToSummary(
          repositoryDecorator(testSuiteFixture, repositoryFixture.repository)
        )
      ).toEqual({
        attributes: {
          'data-testid': 'govuk-summary-list'
        },
        classes: 'app-summary-list govuk-!-margin-bottom-8',
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
                'https://github.com/DEFRA/cdp-portal-smoke-tests'
              )
            }
          },
          {
            key: {
              text: 'Topics'
            },
            value: {
              html: expect.stringContaining('frontend')
            }
          },
          {
            key: {
              text: 'Created'
            },
            value: {
              html: expect.stringContaining('Wed 12th Apr 2023 at 17:16')
            }
          }
        ]
      })
    })
  })
})
