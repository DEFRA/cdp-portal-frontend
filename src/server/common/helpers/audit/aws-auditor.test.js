import { AwsAuditor } from '~/src/server/common/helpers/audit/aws-auditor'
import { FirehoseClient, PutRecordCommand } from '@aws-sdk/client-firehose'

jest.mock('@aws-sdk/client-firehose')

describe('#AwsAuditor', () => {
  const mockInfoLogger = jest.fn()
  const mockErrorLogger = jest.fn()
  let auditor

  beforeEach(() => {
    auditor = new AwsAuditor({
      audit: { source: 'mock-service-name', isAuditEnabled: true },
      region: 'eu-west-2',
      logger: {
        info: mockInfoLogger,
        error: mockErrorLogger
      }
    })
  })

  test('Should set up FirehoseClient as expected', () => {
    expect(FirehoseClient).toHaveBeenCalledWith({
      credentials: expect.any(Function),
      region: 'eu-west-2'
    })
  })

  describe('With incorrect payload', () => {
    test('Should not send audit with incorrect cdp request id', async () => {
      const mockFirehoseClientInstance = FirehoseClient.mock.instances[0]
      const mockFirehoseSend = mockFirehoseClientInstance.send

      await auditor.send(null, 'test-message')

      expect(mockErrorLogger).toHaveBeenCalledWith(
        `Invalid audit payload: ValidationError: "cdpRequestId" must be a string`
      )
      expect(mockFirehoseSend).not.toHaveBeenCalled()
    })

    test('Should not send audit without a message', async () => {
      const mockFirehoseClientInstance = FirehoseClient.mock.instances[0]
      const mockFirehoseSend = mockFirehoseClientInstance.send

      await auditor.send('mock-service-name', null, { foo: 'bar' })

      expect(mockErrorLogger).toHaveBeenCalledWith(
        `Invalid audit payload: ValidationError: "message" contains an invalid value`
      )
      expect(mockFirehoseSend).not.toHaveBeenCalled()
    })
  })

  describe('With valid payload', () => {
    test('Should send audit with message string', async () => {})
    test('Should send audit with message object', async () => {})
  })

  describe('When send throws', () => {
    test('Should log expected error', async () => {})
  })

  /*
  test('accepts and sends a valid payload', async () => {
    await auditor.send('1234', 'test', { foo: 'bar' })
    expect(firehoseClientMock.send).toHaveBeenCalled()
  })
  */
})
