import { auditMessageSchema } from '~/src/server/common/helpers/audit/schema/audit-message-schema'

describe('#auditMessageSchema', () => {
  test('Should allow standard audit message', async () => {
    const payload = {
      event: 'audit event',
      data: { repository: 'repository name' },
      user: {
        id: 'id',
        email: 'email',
        displayName: 'displayName'
      }
    }
    const { error, warn, value } = auditMessageSchema.validate(payload)

    expect(error).toBeUndefined()
    expect(warn).toBeUndefined()
    expect(value).toEqual(payload)
  })

  test('Should allow only event', async () => {
    const payload = {
      event: 'audit event'
    }
    const { error, warn, value } = auditMessageSchema.validate(payload)

    expect(error).toBeUndefined()
    expect(warn).toBeUndefined()
    expect(value).toEqual(payload)
  })

  test('Should not allow without event', async () => {
    const payload = {
      data: { repository: 'repository name' },
      user: {
        id: 'id',
        email: 'email',
        displayName: 'displayName'
      }
    }
    const { error } = auditMessageSchema.validate(payload)

    expect(error.message).toEqual('"event" is required')
  })

  test('Should not allow other user properties', async () => {
    const payload = {
      event: 'audit event',
      data: { repository: 'repository name' },
      user: {
        id: 'id',
        email: 'email',
        displayName: 'displayName',
        token: 'secret token'
      }
    }
    const { error } = auditMessageSchema.validate(payload)

    expect(error.message).toEqual('"user.token" is not allowed')
  })

  test('Should not allow other root properties', async () => {
    const payload = {
      event: 'audit event',
      data: { repository: 'repository name' },
      image: { name: 'repository name' },
      user: {
        id: 'id',
        email: 'email',
        displayName: 'displayName'
      }
    }
    const { error } = auditMessageSchema.validate(payload)

    expect(error.message).toEqual('"image" is not allowed')
  })
})
