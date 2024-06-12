import { auditSchema } from '~/src/server/common/helpers/audit/schema/audit-schema'

describe('#audit-schema', () => {
  test('Should validate an audit schema', () => {
    const payload = {
      source: 'foo',
      created: new Date(0),
      cdpRequestId: 'x-1234',
      message: 'this is a simple audit message',
      tags: {
        foo: 'bar',
        baz: '1234'
      }
    }

    const { error, warn, value } = auditSchema.validate(payload)

    expect(error).toBeUndefined()
    expect(warn).toBeUndefined()
    expect(value).toEqual(payload)
  })

  test('Should fill in default values', () => {
    const value = auditSchema.validate({
      source: 'foo',
      cdpRequestId: 'x-1234',
      message: 'this is another audit message'
    }).value

    expect(value.tags).toEqual({})
    expect(value.created).toBeInstanceOf(Date)
  })
})
