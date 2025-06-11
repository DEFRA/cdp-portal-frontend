import { noValue } from '~/src/server/common/constants/no-value.js'
import { shutteringDetailToSummary } from './shuttering-detail-to-summary.js'
import { shutteringStatus } from '~/src/server/common/constants/shuttering.js'

describe('#shutteringDetailToSummary', () => {
  test('Should return summary with all fields populated for a frontend service', () => {
    const result = shutteringDetailToSummary({
      isFrontend: true,
      shutteringDetail: {
        url: 'frontend-service.com',
        environment: 'prod',
        status: shutteringStatus.active
      },
      authedUser: { displayName: 'B. A. Baracus' }
    })

    expect(result.rows).toEqual([
      {
        key: { text: 'Service URL' },
        value: {
          html: expect.stringContaining('href="https://frontend-service.com"')
        }
      },
      { key: { text: 'Environment' }, value: { text: 'Prod' } },
      {
        key: { text: 'Status' },
        value: { html: expect.stringContaining('Active') }
      },
      { key: { text: 'Requested By' }, value: { text: 'B. A. Baracus' } }
    ])
  })

  test('Should return summary with all fields populated for a non-frontend service', () => {
    const result = shutteringDetailToSummary({
      isFrontend: false,
      shutteringDetail: {
        url: 'api-gateway.com',
        environment: 'dev',
        status: shutteringStatus.shuttered
      },
      authedUser: { displayName: 'RoboCop' }
    })

    expect(result.rows).toEqual(
      expect.arrayContaining([
        {
          key: { text: 'API Gateway URL' },
          value: {
            html: expect.stringContaining('href="https://api-gateway.com"')
          }
        },
        { key: { text: 'Environment' }, value: { text: 'Dev' } },
        {
          key: { text: 'Status' },
          value: { html: expect.stringContaining('Shuttered') }
        },
        { key: { text: 'Requested By' }, value: { text: 'RoboCop' } }
      ])
    )
  })

  test('Should handles missing optional fields gracefully', () => {
    const result = shutteringDetailToSummary({
      isFrontend: true,
      shutteringDetail: {
        url: 'missing-fields.com',
        environment: 'management',
        status: shutteringStatus.active
      },
      authedUser: null
    })

    expect(result.rows).toEqual(
      expect.arrayContaining([
        {
          key: { text: 'Requested By' },
          value: { text: noValue }
        }
      ])
    )
  })
})
