import { scopes } from '@defra/cdp-validation-kit'

import { getAvailableTools } from './get-available-tools.js'
import { getToolDescriptions } from './tool-descriptions.js'

const fullEntity = {
  environments: {
    dev: {
      sql_database: { arn: 'arn:aws:rds:example' },
      tenant_config: { mongo: true }
    }
  }
}

describe('#getToolDescriptions', () => {
  test('admin sees three cards without latest duplicates', () => {
    const availableTools = getAvailableTools(fullEntity, [scopes.admin])
    const descriptions = getToolDescriptions(availableTools)

    expect(descriptions.map(({ value }) => value)).toEqual([
      'terminal',
      'pgweb',
      'dbgate'
    ])
  })

  test('tenant without betaTester sees terminal card only', () => {
    const availableTools = getAvailableTools(fullEntity, [scopes.tenant])
    const descriptions = getToolDescriptions(availableTools)

    expect(descriptions.map(({ value }) => value)).toEqual(['terminal'])
  })

  test('betaTester only sees database cards for service capabilities', () => {
    const postgresOnly = {
      environments: {
        dev: {
          sql_database: { arn: 'arn:aws:rds:example' },
          tenant_config: {}
        }
      }
    }

    const availableTools = getAvailableTools(postgresOnly, [
      'permission:betaTester'
    ])
    const descriptions = getToolDescriptions(availableTools)

    expect(descriptions.map(({ value }) => value)).toEqual([
      'terminal',
      'pgweb'
    ])
  })
})
