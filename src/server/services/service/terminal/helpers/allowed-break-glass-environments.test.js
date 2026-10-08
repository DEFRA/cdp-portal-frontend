import { scopes } from '@defra/cdp-validation-kit'

import { allowedBreakGlassEnvironments } from './allowed-break-glass-environments.js'

describe('#allowedBreakGlassEnvironments', () => {
  test('Should include prod when user has breakGlass scope', () => {
    const result = allowedBreakGlassEnvironments({
      userScopes: [`${scopes.breakGlass}:team:platform`],
      teams: [{ teamId: 'platform' }],
      entity: { environments: { prod: { sqs_queues: [] } } }
    })

    expect(result).toEqual(['dev', 'test', 'perf-test', 'prod'])
  })

  test('Should not include prod when user does not have breakGlass scope', () => {
    const result = allowedBreakGlassEnvironments({
      userScopes: [],
      teams: [{ teamId: 'platform' }],
      entity: { environments: { prod: { sqs_queues: [] } } }
    })
    expect(result).toEqual(['dev', 'test', 'perf-test'])
  })

  test('Should include prod when user has user breakGlass scope', () => {
    const result = allowedBreakGlassEnvironments({
      userScopes: [scopes.breakGlass],
      teams: [{ teamId: 'platform' }],
      entity: { environments: { prod: { sqs_queues: [] } } }
    })
    expect(result).toEqual(['dev', 'test', 'perf-test', 'prod'])
  })

  test('Should not include prod when user does not have user breakGlass scope', () => {
    const result = allowedBreakGlassEnvironments({
      userScopes: [],
      teams: [{ teamId: 'platform' }],
      entity: { environments: { prod: { sqs_queues: [] } } }
    })
    expect(result).toEqual(['dev', 'test', 'perf-test'])
  })

  test('Should include prod for service owner beta tester with prod DLQ', () => {
    const result = allowedBreakGlassEnvironments({
      userScopes: [
        'permission:serviceOwner:team:platform',
        'permission:betaTester'
      ],
      teams: [{ teamId: 'platform' }],
      entity: {
        environments: {
          prod: {
            sqs_queues: [
              {
                deadletter_queue_arn:
                  'arn:aws:sqs:eu-west-2:123456789012:orders-deadletter'
              }
            ]
          }
        }
      }
    })
    expect(result).toEqual(['dev', 'test', 'perf-test', 'prod'])
  })
})
