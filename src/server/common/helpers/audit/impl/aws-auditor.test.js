import { AwsAuditor } from '~/src/server/common/helpers/audit/impl/aws-auditor'

const firehoseClientMock = {
  send: jest.fn()
}

describe('#awsAuditor', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  AwsAuditor._firehose = firehoseClientMock
  const auditor = new AwsAuditor('test')

  test('rejects invalid payload', async () => {
    await auditor.send(null, 'test-message')
    expect(firehoseClientMock.send).not.toHaveBeenCalled()
  })

  test('rejects invalid payload with extra keys', async () => {
    await auditor.send('1234', null, { foo: 'bar' })
    expect(firehoseClientMock.send).not.toHaveBeenCalled()
  })

  test('accepts and sends a valid payload', async () => {
    await auditor.send('1234', 'test', { foo: 'bar' })
    expect(firehoseClientMock.send).toHaveBeenCalled()
  })
})
