import { scopes } from '@defra/cdp-validation-kit'

import { allowedBreakGlassEnvironments } from './allowed-break-glass-environments.js'

describe('#allowedBreakGlassEnvironments', () => {
  test('Should include prod when user has breakGlass scope', () => {
    const result = allowedBreakGlassEnvironments({
      userScopes: [`${scopes.breakGlass}:team:platform`],
      teams: [{ teamId: 'platform' }]
    })

    expect(result).toEqual(['dev', 'test', 'perf-test', 'prod'])
  })

  test('Should not include prod when user does not have breakGlass scope', () => {
    const result = allowedBreakGlassEnvironments({
      userScopes: [],
      teams: [{ teamId: 'platform' }]
    })
    expect(result).toEqual(['dev', 'test', 'perf-test'])
  })

  test('Should include prod when user has user breakGlass scope', () => {
    const result = allowedBreakGlassEnvironments({
      userScopes: [scopes.breakGlass],
      teams: [{ teamId: 'platform' }]
    })
    expect(result).toEqual(['dev', 'test', 'perf-test', 'prod'])
  })

  test('Should not include prod when user does not have user breakGlass scope', () => {
    const result = allowedBreakGlassEnvironments({
      userScopes: [],
      teams: [{ teamId: 'platform' }]
    })
    expect(result).toEqual(['dev', 'test', 'perf-test'])
  })
})
