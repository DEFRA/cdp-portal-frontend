import { scopes } from '@defra/cdp-validation-kit'

import { getAvailableTools } from './get-available-tools.js'

const fullEntity = {
  environments: {
    dev: {
      sql_database: { arn: 'arn:aws:rds:example' },
      tenant_config: { mongo: true }
    },
    prod: {
      tenant_config: {}
    }
  }
}

describe('#getAvailableTools', () => {
  test('admin can launch latest for every tool', () => {
    const tools = getAvailableTools(fullEntity, 'dev', [scopes.admin])
    expect(tools).toEqual([
      { tool: 'terminal', canLaunchLatest: true },
      { tool: 'pgweb', canLaunchLatest: true },
      { tool: 'dbgate', canLaunchLatest: true }
    ])
  })

  test('beta tester gets database tools without latest', () => {
    const tools = getAvailableTools(fullEntity, 'dev', [
      'permission:betaTester'
    ])
    expect(tools).toEqual([
      { tool: 'terminal', canLaunchLatest: false },
      { tool: 'pgweb', canLaunchLatest: false },
      { tool: 'dbgate', canLaunchLatest: false }
    ])
  })

  test('plain tenant gets terminal only', () => {
    const tools = getAvailableTools(fullEntity, 'dev', [scopes.tenant])
    expect(tools).toEqual([{ tool: 'terminal', canLaunchLatest: false }])
  })

  test('postgres and mongo visibility follows service capabilities', () => {
    const postgresOnly = {
      environments: {
        dev: {
          sql_database: { arn: 'arn:aws:rds:example' },
          tenant_config: {}
        }
      }
    }
    const mongoOnly = {
      environments: {
        dev: {
          tenant_config: { mongo: true }
        }
      }
    }

    expect(
      getAvailableTools(postgresOnly, 'dev', ['permission:betaTester'])
    ).toEqual([
      { tool: 'terminal', canLaunchLatest: false },
      { tool: 'pgweb', canLaunchLatest: false }
    ])
    expect(
      getAvailableTools(mongoOnly, 'dev', ['permission:betaTester'])
    ).toEqual([
      { tool: 'terminal', canLaunchLatest: false },
      { tool: 'dbgate', canLaunchLatest: false }
    ])
  })

  test('database tools follow the requested environment only', () => {
    const tools = getAvailableTools(fullEntity, 'prod', [scopes.admin])
    expect(tools).toEqual([{ tool: 'terminal', canLaunchLatest: true }])
  })

  test('central-animal-store team scope alone no longer grants tools', () => {
    const tools = getAvailableTools(fullEntity, 'dev', [
      'team:central-animal-store'
    ])
    expect(tools).toEqual([{ tool: 'terminal', canLaunchLatest: false }])
  })
})
