describe('#auditSchema', () => {
  let auditSchema

  beforeAll(async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2023-04-01').getTime())

    // Dynamic import needed so we can set jest.setSystemTime before the Joi validation schema is imported
    const schemaImport = await import(
      '~/src/server/common/helpers/audit/schema/audit-schema'
    )
    auditSchema = schemaImport.auditSchema
  })

  test('Should validate an audit schema', () => {
    const payload = {
      source: 'mock-service-name',
      created: new Date(),
      cdpRequestId: 'mock-x-cdp-request-id',
      message: 'this is a simple audit message',
      tags: {
        example: 'tag'
      }
    }

    const { error, warn, value } = auditSchema.validate(payload)

    expect(error).toBeUndefined()
    expect(warn).toBeUndefined()
    expect(value).toEqual(payload)
  })

  test('Should fill in default values from schema', () => {
    const { value } = auditSchema.validate({
      source: 'mock-service-name',
      cdpRequestId: 'mock-x-cdp-request-id',
      message: 'this is a simple audit message'
    })

    expect(value.tags).toEqual({})
    expect(value.created).toEqual(new Date('2023-04-01'))
  })
})
