import { sendAuditMessage } from '~/src/server/common/helpers/audit/send-audit-message'

const firehoseClientMock = {
  send: jest.fn()
}

describe('#sendAuditMessage', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('rejects invalid payload', async () => {
    await sendAuditMessage(firehoseClientMock, {}) // Call function
    expect(firehoseClientMock.send).not.toHaveBeenCalled()
  })

  test('rejects invalid payload with extra keys', async () => {
    await sendAuditMessage(firehoseClientMock, {
      source: 'foo',
      message: 'audit',
      id: '1234',
      extra: { a: 'b' }
    })
    expect(firehoseClientMock.send).not.toHaveBeenCalled()
  })

  test('accepts and sends a valid payload', async () => {
    const payload = {
      source: 'foo',
      message: 'audit',
      id: '1234',
      tags: { foo: 'bar' }
    }
    await sendAuditMessage(firehoseClientMock, payload)
    expect(firehoseClientMock.send).toHaveBeenCalled()
  })
})
