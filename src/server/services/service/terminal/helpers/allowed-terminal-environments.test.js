import { scopes } from '@defra/cdp-validation-kit'
import { allowedTerminalEnvironments } from './allowed-terminal-environments.js'

describe('#allowedTerminalEnvironments', () => {
  test('Should include prod when user has breakGlass scope', () => {
    const result = allowedTerminalEnvironments({
      userScopes: [`${scopes.breakGlass}:team:platform`],
      entity: {
        teams: [{ teamId: 'platform' }]
      }
    })

    expect(result).toEqual(['dev', 'test', 'perf-test', 'prod'])
  })

  test('Should not include prod when user does not have breakGlass scope', () => {
    const result = allowedTerminalEnvironments({
      userScopes: [],
      entity: {
        teams: [{ teamId: 'platform' }]
      }
    })
    expect(result).toEqual(['dev', 'test', 'perf-test'])
  })

  test('Should include prod when user has user breakGlass scope', () => {
    const result = allowedTerminalEnvironments({
      userScopes: [scopes.breakGlass],
      entity: {
        teams: [{ teamId: 'platform' }]
      }
    })
    expect(result).toEqual(['dev', 'test', 'perf-test', 'prod'])
  })

  test('Should not include prod when user does not have user breakGlass scope', () => {
    const result = allowedTerminalEnvironments({
      userScopes: [],
      entity: {
        teams: [{ teamId: 'platform' }]
      }
    })
    expect(result).toEqual(['dev', 'test', 'perf-test'])
  })
})
