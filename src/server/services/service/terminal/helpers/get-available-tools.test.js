import { scopes } from '@defra/cdp-validation-kit'

import { getAvailableTools } from './get-available-tools.js'

const fullEntity = {
  environments: {
    dev: {
      sql_database: { arn: 'arn:aws:rds:example' },
      tenant_config: { mongo: true }
    }
  }
}

describe('#getAvailableTools', () => {
  test('admin gets stable and latest tools', () => {
    const tools = getAvailableTools(fullEntity, [scopes.admin])
    expect(tools).toEqual([
      { text: 'Terminal', value: 'terminal' },
      { text: 'Terminal (latest)', value: 'terminal_latest' },
      { text: 'Postgres Web UI', value: 'pgweb' },
      { text: 'Postgres Web UI (latest)', value: 'pgweb_latest' },
      { text: 'MongoDB Web UI', value: 'dbgate' },
      { text: 'MongoDB Web UI (latest)', value: 'dbgate_latest' }
    ])
  })

  test('beta tester gets stable database tools only', () => {
    const tools = getAvailableTools(fullEntity, ['permission:betaTester'])
    expect(tools).toEqual([
      { text: 'Terminal', value: 'terminal' },
      { text: 'Postgres Web UI', value: 'pgweb' },
      { text: 'MongoDB Web UI', value: 'dbgate' }
    ])
  })

  test('plain tenant gets terminal only', () => {
    const tools = getAvailableTools(fullEntity, [scopes.tenant])
    expect(tools).toEqual([{ text: 'Terminal', value: 'terminal' }])
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

    expect(getAvailableTools(postgresOnly, ['permission:betaTester'])).toEqual([
      { text: 'Terminal', value: 'terminal' },
      { text: 'Postgres Web UI', value: 'pgweb' }
    ])
    expect(getAvailableTools(mongoOnly, ['permission:betaTester'])).toEqual([
      { text: 'Terminal', value: 'terminal' },
      { text: 'MongoDB Web UI', value: 'dbgate' }
    ])
  })

  test('central-animal-store team scope alone no longer grants tools', () => {
    const tools = getAvailableTools(fullEntity, ['team:central-animal-store'])
    expect(tools).toEqual([{ text: 'Terminal', value: 'terminal' }])
  })
})
