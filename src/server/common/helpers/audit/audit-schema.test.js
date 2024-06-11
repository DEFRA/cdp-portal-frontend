import { auditSchema } from '~/src/server/common/helpers/audit/audit-schema'

describe('#audit-schema', () => {
  test('Should validate an audit schema', () => {
    const { error, warn, value } = auditSchema.validate({
      source: 'foo',
      created: new Date(0),
      transactionId: 'x-1234',
      message: 'this is a simple audit message',
      tags: {
        foo: 'bar',
        baz: '1234'
      }
    })

    expect(error).toBeUndefined()
    expect(warn).toBeUndefined()
    expect(value).toEqual({
      source: 'foo',
      created: new Date(0),
      transactionId: 'x-1234',
      message: 'this is a simple audit message',
      tags: {
        foo: 'bar',
        baz: '1234'
      }
    })
  })

  test('Should fill in default values', () => {
    const value = auditSchema.validate({
      source: 'foo',
      transactionId: 'x-1234',
      message: 'this is a simple audit message'
    }).value

    expect(value.tags).toEqual({})
    expect(value.created).toBeInstanceOf(Date)
  })
})
