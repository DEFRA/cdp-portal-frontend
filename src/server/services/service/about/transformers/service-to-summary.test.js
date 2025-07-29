import { repositoryFixture } from '../../../../../__fixtures__/repository.js'
import { transformServiceToSummary } from './service-to-summary.js'
import { entityServicesFixture } from '../../../../../__fixtures__/services/entities.js'

describe('#transformServiceToSummary', () => {
  beforeAll(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-04-01'))
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  test('Should provide expected service summary', () => {
    expect(
      transformServiceToSummary(repositoryFixture, entityServicesFixture[1])
    ).toEqual({
      attributes: {
        'data-testid': 'service-summary'
      },
      classes: 'app-summary-list govuk-!-margin-bottom-0',
      rows: [
        {
          key: {
            text: 'Kind'
          },
          value: {
            html: expect.stringContaining('Frontend')
          }
        },
        {
          key: {
            text: 'Tags'
          },
          value: {
            html: expect.stringContaining('Live')
          }
        },
        {
          key: {
            text: 'Image name'
          },
          value: {
            text: 'cdp-portal-frontend'
          }
        },
        {
          key: {
            text: 'GitHub Repository'
          },
          value: {
            html: expect.stringContaining(
              'https://github.com/DEFRA/cdp-portal-frontend'
            )
          }
        },
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
            text: 'Topics'
          },
          value: {
            html: expect.stringContaining('frontend')
          }
        },
        {
          key: {
            text: 'Docker Hub'
          },
          value: {
            html: expect.stringContaining(
              'https://hub.docker.com/r/defradigital/cdp-portal-frontend/tags'
            )
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
