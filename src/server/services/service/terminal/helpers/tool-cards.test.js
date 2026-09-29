import { scopes } from '@defra/cdp-validation-kit'

import { getAvailableTools } from './get-available-tools.js'
import { getToolCards } from './tool-cards.js'

const fullEntity = {
  environments: {
    dev: {
      sql_database: { arn: 'arn:aws:rds:example' },
      tenant_config: { mongo: true }
    }
  }
}

describe('#getToolCards', () => {
  test('admin sees one card per tool with a latest variant', () => {
    const availableTools = getAvailableTools(fullEntity, [scopes.admin])
    const cards = getToolCards(availableTools)

    expect(
      cards.map(({ value, latestValue }) => ({ value, latestValue }))
    ).toEqual([
      { value: 'terminal', latestValue: 'terminal_latest' },
      { value: 'pgweb', latestValue: 'pgweb_latest' },
      { value: 'dbgate', latestValue: 'dbgate_latest' }
    ])
  })

  test('tenant without betaTester sees terminal card only', () => {
    const availableTools = getAvailableTools(fullEntity, [scopes.tenant])
    const cards = getToolCards(availableTools)

    expect(cards).toEqual([
      expect.objectContaining({ value: 'terminal', title: 'Terminal' })
    ])
    expect(cards[0]).not.toHaveProperty('latestValue')
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
    const cards = getToolCards(availableTools)

    expect(cards.map(({ value }) => value)).toEqual(['terminal', 'pgweb'])
    expect(cards.some((card) => card.latestValue)).toBe(false)
  })

  test('ignores tools without a description', () => {
    const cards = getToolCards([
      { text: 'Unknown', value: 'unknown', tool: 'unknown' }
    ])

    expect(cards).toEqual([])
  })
})
