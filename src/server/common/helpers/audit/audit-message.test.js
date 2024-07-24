import { auditMessage } from '~/src/server/common/helpers/audit/audit-message'

describe('#auditMessage', () => {
  test('Should create json with repository and user', async () => {
    const result = auditMessage({
      event: 'audit event',
      data: { repository: 'repository name' },
      user: {
        id: 'id',
        email: 'email',
        displayName: 'displayName'
      }
    })
    expect(result).toEqual({
      event: 'audit event',
      data: { repository: 'repository name' },
      user: {
        id: 'id',
        email: 'email',
        displayName: 'displayName'
      }
    })
  })

  test('Should create json without repository', async () => {
    const result = auditMessage({
      event: 'audit event',
      user: {
        id: 'id',
        email: 'email',
        displayName: 'displayName'
      }
    })
    expect(result).toEqual({
      event: 'audit event',
      user: {
        id: 'id',
        email: 'email',
        displayName: 'displayName'
      }
    })
  })

  test('Should have user without email', async () => {
    const result = auditMessage({
      event: 'audit event',
      user: {
        id: 'id',
        displayName: 'displayName'
      }
    })
    expect(result).toEqual({
      event: 'audit event',
      user: {
        id: 'id',
        displayName: 'displayName'
      }
    })
  })

  test('Should allow without event', async () => {
    const result = auditMessage({
      user: {
        id: 'id',
        displayName: 'displayName'
      }
    })
    expect(result).toEqual({
      user: {
        id: 'id',
        displayName: 'displayName'
      }
    })
  })
})
