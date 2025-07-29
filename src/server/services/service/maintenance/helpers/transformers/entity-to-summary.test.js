import { noValue } from '../../../../../common/constants/no-value.js'
import { entityToSummary } from './entity-to-summary.js'

describe('#entityToSummary', () => {
  const mockEntity = { name: 'mock-service' }
  const mockDeployedService = {
    service: 'mock-service',
    environment: 'dev',
    status: 'Running',
    statusClassname: 'status-running',
    version: 'v1.0.0'
  }
  const mockEnvironment = 'Development'
  const mockAuthedUser = { displayName: 'RoboCop' }
  const mockServiceUrl = 'https://mock-service.dev.cdp-int.defra.cloud'

  test('Should return a summary with all fields populated for a frontend service', () => {
    const result = entityToSummary({
      entity: mockEntity,
      deployedService: mockDeployedService,
      environment: mockEnvironment,
      authedUser: mockAuthedUser,
      isFrontend: true
    })

    expect(result.rows).toEqual([
      {
        key: { text: 'Service name' },
        value: { html: expect.stringContaining('mock-service') }
      },
      { key: { text: 'Environment' }, value: { text: 'Development' } },
      {
        key: { text: 'Status' },
        value: { html: expect.stringContaining('Running') }
      },
      {
        key: { text: 'Version' },
        value: { html: expect.stringContaining('v1.0.0') }
      },
      {
        key: { text: 'CDP Service URL' },
        value: {
          html: expect.stringContaining(mockServiceUrl)
        }
      },
      { key: { text: 'Requested By' }, value: { text: 'RoboCop' } }
    ])
  })

  test('Should return a summary with a plain URL for a non-frontend service', () => {
    const result = entityToSummary({
      entity: mockEntity,
      deployedService: mockDeployedService,
      environment: mockEnvironment,
      authedUser: mockAuthedUser,
      isFrontend: false
    })

    expect(result.rows).toEqual(
      expect.arrayContaining([
        {
          key: { text: 'CDP Service URL' },
          value: { html: mockServiceUrl }
        }
      ])
    )
  })

  test('Should return noValue for missing version', () => {
    const result = entityToSummary({
      entity: mockEntity,
      deployedService: { ...mockDeployedService, version: null },
      environment: mockEnvironment,
      authedUser: mockAuthedUser,
      isFrontend: true
    })

    expect(result.rows).toEqual(
      expect.arrayContaining([
        {
          key: { text: 'Version' },
          value: { html: noValue }
        }
      ])
    )
  })

  test('Should handle missing optional fields gracefully', () => {
    const result = entityToSummary({
      entity: mockEntity,
      deployedService: { service: 'mock-service', environment: 'dev' },
      environment: mockEnvironment,
      authedUser: { displayName: null },
      isFrontend: true
    })

    expect(result.rows).toEqual(
      expect.arrayContaining([
        {
          key: { text: 'Requested By' },
          value: { text: '- - -' }
        }
      ])
    )
  })
})
