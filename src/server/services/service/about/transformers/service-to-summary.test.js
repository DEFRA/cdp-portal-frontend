import { repositoryFixture } from '~/src/__fixtures__/repository.js'
import { transformServiceToSummary } from '~/src/server/services/service/about/transformers/service-to-summary.js'
import { serviceFixture } from '~/src/__fixtures__/entity.js'

describe('#transformServiceToSummary', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2025-04-01'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  test('Should provide expected service summary', () => {
    expect(
      transformServiceToSummary(repositoryFixture, serviceFixture)
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
            text: '- - -'
          }
        },
        {
          key: {
            text: 'Topics'
          },
          value: {
            html: '- - -'
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
            html: expect.stringContaining('Wed 12th Apr 2023 at 17:16')
          }
        }
      ]
    })
  })
})
