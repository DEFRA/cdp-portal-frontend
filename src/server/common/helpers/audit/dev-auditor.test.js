describe('#DevAuditor', () => {
  const mockInfoLogger = jest.fn()
  const mockErrorLogger = jest.fn()
  let DevAuditor
  let auditor

  beforeAll(async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2023-04-01').getTime())

    // Dynamic import needed so we can set jest.setSystemTime before the Joi validation schema is imported
    const auditorImport = await import(
      '~/src/server/common/helpers/audit/dev-auditor'
    )
    DevAuditor = auditorImport.DevAuditor
  })

  beforeEach(() => {
    auditor = new DevAuditor({
      audit: { source: 'mock-service-name' },
      logger: {
        info: mockInfoLogger,
        error: mockErrorLogger
      }
    })
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe('With correct payload', () => {
    test('Should log with message string', async () => {
      await auditor.send('example-message', { example: 'tag' })

      expect(mockInfoLogger).toHaveBeenNthCalledWith(
        1,
        'Auditing x-cdp-request-id-header-not-set'
      )
      expect(mockInfoLogger).toHaveBeenNthCalledWith(
        2,
        {
          auditDetail: {
            cdpRequestId: 'x-cdp-request-id-header-not-set',
            source: 'mock-service-name',
            message: 'example-message',
            tags: { example: 'tag' },
            created: '2023-04-01T00:00:00.000Z'
          }
        },
        'Mock Audit: x-cdp-request-id-header-not-set - example-message'
      )
    })

    test('Should log with message object', async () => {
      await auditor.send(
        { user: 'jeff', age: 24, id: 'mock-user-id' },
        { example: 'tag' }
      )

      expect(mockInfoLogger).toHaveBeenNthCalledWith(
        1,
        'Auditing x-cdp-request-id-header-not-set'
      )
      expect(mockInfoLogger).toHaveBeenNthCalledWith(
        2,
        {
          auditDetail: {
            cdpRequestId: 'x-cdp-request-id-header-not-set',
            source: 'mock-service-name',
            message: { user: 'jeff', age: 24, id: 'mock-user-id' },
            tags: { example: 'tag' },
            created: '2023-04-01T00:00:00.000Z'
          }
        },
        'Mock Audit: x-cdp-request-id-header-not-set'
      )
    })
  })

  describe('With incorrect payload', () => {
    test('Should error log without a message', async () => {
      await auditor.send(null, { foo: 'bar' })

      expect(mockErrorLogger).toHaveBeenCalledWith(
        `Invalid audit payload: ValidationError: "message" contains an invalid value`
      )
    })
  })
})
