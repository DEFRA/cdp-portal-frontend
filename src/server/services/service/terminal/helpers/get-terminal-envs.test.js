import { getTerminalEnvs } from './get-terminal-envs.js'
import { scopes } from '@defra/cdp-validation-kit'

describe('#getTerminalEnvs', () => {
  test('Should return empty array when neither serviceName or entity are provided', async () => {
    const result = await getTerminalEnvs({})
    expect(result).toEqual([])
  })

  test('Should include prod when user has breakGlass scope for services team', async () => {
    const result = await getTerminalEnvs({
      serviceName: 'cdp-portal-frontend',
      userScopes: [`${scopes.breakGlass}:team:platform`],
      entity: {
        teams: [{ teamId: 'platform' }],
        environments: { dev: {}, prod: {} }
      }
    })
    expect(result).toEqual(['dev', 'prod'])
  })

  test('Should not include prod when user does not have breakGlass scope for services team', async () => {
    const result = await getTerminalEnvs({
      serviceName: 'cdp-portal-frontend',
      userScopes: [],
      entity: {
        teams: [{ teamId: 'platform' }],
        environments: { dev: {}, prod: {} }
      }
    })
    expect(result).toEqual(['dev'])
  })

  test('Should include prod when user has breakGlass user scope', async () => {
    const result = await getTerminalEnvs({
      serviceName: 'cdp-portal-frontend',
      userScopes: [scopes.breakGlass],
      entity: {
        teams: [{ teamId: 'platform' }],
        environments: { dev: {}, prod: {} }
      }
    })
    expect(result).toEqual(['dev', 'prod'])
  })

  test('Should not include prod when user does not have breakGlass user scope', async () => {
    const result = await getTerminalEnvs({
      serviceName: 'cdp-portal-frontend',
      userScopes: [],
      entity: {
        teams: [{ teamId: 'platform' }],
        environments: { dev: {}, prod: {} }
      }
    })
    expect(result).toEqual(['dev'])
  })
})
