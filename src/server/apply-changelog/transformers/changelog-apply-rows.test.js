import { changelogApplyRows } from '~/src/server/apply-changelog/transformers/changelog-apply-rows.js'

describe('#changelogApplyRows', () => {
  test('Should return rows with correct keys and values for valid details', () => {
    const details = {
      serviceName: 'Service A',
      version: '1.0.0',
      environment: 'Production'
    }
    const multiStepDataSessionId = '12345'
    const rows = changelogApplyRows(details, multiStepDataSessionId)

    expect(rows).toHaveLength(3)

    const firstRow = rows.at(0)
    expect(firstRow.key.text).toBe('Microservice name')
    expect(firstRow.value.html).toBe('Service A')
    expect(firstRow.actions.items.at(0).href).toContain(
      '/apply-changelog/change-details/12345'
    )

    expect(rows.at(1).key.text).toBe('Changelog version')
    expect(rows.at(1).value.html).toBe('1.0.0')

    expect(rows.at(2).key.text).toBe('Environment')
    expect(rows.at(2).value.html).toBe('Production')
  })

  test('handles empty details gracefully', () => {
    const details = {}
    const multiStepDataSessionId = '12345'
    const rows = changelogApplyRows(details, multiStepDataSessionId)

    expect(rows).toHaveLength(3)
    expect(rows.at(0).value.html).toBeUndefined()
    expect(rows.at(1).value.html).toBeUndefined()
    expect(rows.at(2).value.html).toBeUndefined()
  })

  test('includes query string in action href', () => {
    const details = {
      serviceName: 'Service B',
      version: '2.0.0',
      environment: 'Staging'
    }
    const multiStepDataSessionId = '67890'
    const rows = changelogApplyRows(details, multiStepDataSessionId)

    rows.forEach((row) => {
      expect(row.actions.items.at(0).href).toContain(
        '?redirectLocation=summary'
      )
    })
  })
})
