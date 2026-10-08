import { scopes } from '@defra/cdp-validation-kit'

import { getAvailableTools } from './get-available-tools.js'

const fullEntity = {
  teams: [{ teamId: 'platform' }],
  environments: {
    dev: {
      sql_database: { arn: 'arn:aws:rds:example' },
      tenant_config: { mongo: true },
      sqs_queues: [
        {
          name: 'orders',
          deadletter_queue_arn:
            'arn:aws:sqs:eu-west-2:123456789012:orders-deadletter'
        }
      ]
    },
    prod: {
      tenant_config: {},
      sqs_queues: [
        {
          name: 'orders',
          deadletter_queue_arn:
            'arn:aws:sqs:eu-west-2:123456789012:orders-deadletter'
        }
      ]
    }
  }
}

describe('#getAvailableTools', () => {
  test('admin can launch latest for every tool', () => {
    const tools = getAvailableTools(fullEntity, 'dev', [scopes.admin])
    expect(tools).toEqual([
      { tool: 'terminal', canLaunchLatest: true },
      { tool: 'pgweb', canLaunchLatest: true },
      { tool: 'dbgate', canLaunchLatest: true },
      { tool: 'sqs_tool', canLaunchLatest: true }
    ])
  })

  test('beta tester gets database tools without latest', () => {
    const tools = getAvailableTools(fullEntity, 'dev', [
      'permission:betaTester'
    ])
    expect(tools).toEqual([
      { tool: 'terminal', canLaunchLatest: false },
      { tool: 'pgweb', canLaunchLatest: false },
      { tool: 'dbgate', canLaunchLatest: false },
      { tool: 'sqs_tool', canLaunchLatest: false }
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
    const tools = getAvailableTools(fullEntity, 'prod', [
      scopes.breakGlass,
      scopes.admin
    ])
    expect(tools).toEqual([
      { tool: 'terminal', canLaunchLatest: true },
      { tool: 'sqs_tool', canLaunchLatest: true }
    ])
  })

  test('admin without breakglass only gets tools explicitly allowed in prod', () => {
    const tools = getAvailableTools(fullEntity, 'prod', [scopes.admin])
    expect(tools).toEqual([{ tool: 'sqs_tool', canLaunchLatest: true }])
  })

  test('central-animal-store team scope alone no longer grants tools', () => {
    const tools = getAvailableTools(fullEntity, 'dev', [
      'team:central-animal-store'
    ])
    expect(tools).toEqual([{ tool: 'terminal', canLaunchLatest: false }])
  })

  test('prod without breakglass only returns tools explicitly allowed in prod', () => {
    const tools = getAvailableTools(fullEntity, 'prod', [
      'permission:betaTester',
      'permission:serviceOwner:team:platform'
    ])
    expect(tools).toEqual([{ tool: 'sqs_tool', canLaunchLatest: false }])
  })

  test('prod with breakglass can access full tool list', () => {
    const tools = getAvailableTools(fullEntity, 'prod', [
      scopes.breakGlass,
      scopes.admin
    ])
    expect(tools).toEqual([
      { tool: 'terminal', canLaunchLatest: true },
      { tool: 'sqs_tool', canLaunchLatest: true }
    ])
  })
})
