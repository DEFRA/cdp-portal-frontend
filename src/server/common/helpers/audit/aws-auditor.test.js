import { AwsAuditor } from '~/src/server/common/helpers/audit/aws-auditor'
import { FirehoseClient, PutRecordCommand } from '@aws-sdk/client-firehose'

jest.mock('@aws-sdk/client-firehose')

describe('#AwsAuditor', () => {
  const mockInfoLogger = jest.fn()
  const mockErrorLogger = jest.fn()

  describe('Without "x-cdp-request-id" header', () => {
    let auditor

    beforeEach(() => {
      auditor = new AwsAuditor({
        audit: { source: 'mock-service-name' },
        region: 'eu-west-2',
        request: {
          headers: {}
        },
        logger: {
          info: mockInfoLogger,
          error: mockErrorLogger
        }
      })
    })

    test('Should not send audit with incorrect cdp request id', async () => {
      const mockFirehoseSend = FirehoseClient.mock.instances[0].send

      await auditor.send('example-message')

      expect(mockErrorLogger).toHaveBeenCalledWith(
        `Audit invalid payload - Request id: undefined: ValidationError: "cdpRequestId" is required`
      )
      expect(mockFirehoseSend).not.toHaveBeenCalled()
    })
  })

  describe('With "x-cdp-request-id" header', () => {
    let auditor

    beforeEach(() => {
      auditor = new AwsAuditor({
        audit: { source: 'mock-service-name' },
        region: 'eu-west-2',
        request: {
          headers: {
            'x-cdp-request-id': 'mock-x-cdp-request-id'
          }
        },
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

    describe('With correct payload', () => {
      test('Should send audit with message string', async () => {
        const mockFirehoseSend = FirehoseClient.mock.instances[0].send
        mockFirehoseSend.mockResolvedValueOnce({ RecordId: 'Mock Record' })

        await auditor.send('example-message', { foo: 'bar' })

        expect(mockInfoLogger).toHaveBeenNthCalledWith(
          1,
          'Audit - Request id: mock-x-cdp-request-id'
        )
        expect(PutRecordCommand).toHaveBeenCalledTimes(1)
        expect(mockFirehoseSend).toHaveBeenCalledTimes(1)
        expect(mockInfoLogger).toHaveBeenNthCalledWith(
          2,
          'Audit delivered - Request id: mock-x-cdp-request-id: Mock Record'
        )
      })

      test('Should send audit with message object', async () => {
        const mockFirehoseSend = FirehoseClient.mock.instances[0].send
        mockFirehoseSend.mockResolvedValueOnce({ RecordId: 'Mock Record' })

        await auditor.send(
          { user: 'jeff', age: 24, id: 'mock-user-id' },
          { foo: 'bar' }
        )

        expect(mockInfoLogger).toHaveBeenNthCalledWith(
          1,
          'Audit - Request id: mock-x-cdp-request-id'
        )
        expect(PutRecordCommand).toHaveBeenCalledTimes(1)
        expect(mockFirehoseSend).toHaveBeenCalledTimes(1)
        expect(mockInfoLogger).toHaveBeenNthCalledWith(
          2,
          'Audit delivered - Request id: mock-x-cdp-request-id: Mock Record'
        )
      })
    })

    describe('With incorrect payload', () => {
      test('Should not send audit without a message', async () => {
        const mockFirehoseSend = FirehoseClient.mock.instances[0].send

        await auditor.send(null, { foo: 'bar' })

        expect(mockErrorLogger).toHaveBeenCalledWith(
          `Audit invalid payload - Request id: mock-x-cdp-request-id: ValidationError: "message" contains an invalid value`
        )
        expect(mockFirehoseSend).not.toHaveBeenCalled()
      })
    })

    describe('When send throws', () => {
      test('Should log expected error', async () => {
        const mockFirehoseSend = FirehoseClient.mock.instances[0].send
        mockFirehoseSend.mockRejectedValue(
          Error('Something bad has happened!😱')
        )

        await auditor.send('example-message')

        expect(PutRecordCommand).toHaveBeenCalledTimes(1)
        expect(mockFirehoseSend).toHaveBeenCalledTimes(1)
        expect(mockErrorLogger).toHaveBeenCalledWith(
          'Audit failed - Request id: mock-x-cdp-request-id - Something bad has happened!😱'
        )
      })
    })
  })
})
