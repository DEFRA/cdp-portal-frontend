import { provideFormContextValues } from '~/src/server/deploy-service/helpers/provide-form-context-values'

const buildMockRequest = ({
  variety = 'view',
  get = () => ({}),
  flash = () => [],
  source = {}
} = {}) => ({
  response: {
    variety,
    source
  },
  yar: {
    get,
    flash
  }
})

describe('#provideFormContextValues', () => {
  const mockResponseToolkit = {
    continue: 'mockContinue'
  }

  describe('When variety is not "view"', () => {
    test('Source context should not be set', () => {
      const mockRequest = buildMockRequest({ variety: 'plain' })
      provideFormContextValues(mockRequest, mockResponseToolkit)

      expect(mockRequest.response?.source?.context).toBeUndefined()
    })
  })

  describe('When variety is "view"', () => {
    test('Source context should be set', () => {
      const mockRequest = buildMockRequest()
      provideFormContextValues(mockRequest, mockResponseToolkit)

      expect(mockRequest.response?.source?.context).toEqual({
        availableMemoryOptions: [],
        availableVersionOptions: [],
        formValues: {}
      })
    })

    describe('Form values', () => {
      test('Validation failure flash values should have highest priority', () => {
        const mockRequest = buildMockRequest({
          get: () => ({ imageName: 'mock-deployment-image-name' }),
          flash: () => [
            {
              formValues: {
                imageName: 'mock-validation-failure-image-name'
              }
            }
          ],
          source: {
            context: {
              formValues: {
                imageName: 'mock-view-context-image-name'
              }
            }
          }
        })

        provideFormContextValues(mockRequest, mockResponseToolkit)

        expect(mockRequest.response?.source?.context).toEqual({
          availableMemoryOptions: [],
          availableVersionOptions: [],
          formValues: {
            imageName: 'mock-validation-failure-image-name'
          },
          isError: true
        })
      })

      test('Deployment session values should have medium priority', () => {
        const mockRequest = buildMockRequest({
          get: () => ({ imageName: 'mock-deployment-image-name' }),
          source: {
            context: {
              formValues: {
                imageName: 'mock-view-context-image-name'
              }
            }
          }
        })

        provideFormContextValues(mockRequest, mockResponseToolkit)

        expect(mockRequest.response?.source?.context).toEqual({
          availableMemoryOptions: [],
          availableVersionOptions: [],
          formValues: {
            imageName: 'mock-deployment-image-name'
          }
        })
      })

      test('View context values should have lowest priority', () => {
        const mockRequest = buildMockRequest({
          source: {
            context: {
              formValues: {
                imageName: 'mock-view-context-image-name'
              }
            }
          }
        })

        provideFormContextValues(mockRequest, mockResponseToolkit)

        expect(mockRequest.response?.source?.context).toEqual({
          availableMemoryOptions: [],
          availableVersionOptions: [],
          formValues: {
            imageName: 'mock-view-context-image-name'
          }
        })
      })
    })

    describe('With validation failures', () => {
      test('Should add "isError" to context', () => {
        const mockRequest = buildMockRequest({
          flash: () => [
            {
              formValues: {
                imageName: 'mock-validation-failure-image-name'
              }
            }
          ]
        })

        provideFormContextValues(mockRequest, mockResponseToolkit)

        expect(mockRequest.response?.source?.context).toEqual(
          expect.objectContaining({
            isError: true
          })
        )
      })
    })

    describe('Available versions select options', () => {
      test('Validation failure values should have highest priority', () => {
        const mockRequest = buildMockRequest({
          flash: () => [
            {
              availableVersionOptions: [{ value: '0.1.0', text: '0.1.0' }]
            }
          ],
          source: {
            context: {
              availableVersionOptions: [{ value: '0.2.0', text: '0.2.0' }]
            }
          }
        })

        provideFormContextValues(mockRequest, mockResponseToolkit)

        expect(mockRequest.response?.source?.context).toEqual({
          availableMemoryOptions: [],
          availableVersionOptions: [{ value: '0.1.0', text: '0.1.0' }],
          formValues: {},
          isError: true
        })
      })

      test('View context values should have lowest priority', () => {
        const mockRequest = buildMockRequest({
          source: {
            context: {
              availableVersionOptions: [{ value: '0.2.0', text: '0.2.0' }]
            }
          }
        })

        provideFormContextValues(mockRequest, mockResponseToolkit)

        expect(mockRequest.response?.source?.context).toEqual({
          availableMemoryOptions: [],
          availableVersionOptions: [{ value: '0.2.0', text: '0.2.0' }],
          formValues: {}
        })
      })
    })

    describe('Available memory select options', () => {
      test('Validation failure values should have highest priority', () => {
        const mockRequest = buildMockRequest({
          flash: () => [
            {
              availableMemoryOptions: [{ value: 2048, text: '2 GB' }]
            }
          ],
          source: {
            context: {
              availableMemoryOptions: [{ value: 3072, text: '3 GB' }]
            }
          }
        })

        provideFormContextValues(mockRequest, mockResponseToolkit)

        expect(mockRequest.response?.source?.context).toEqual({
          availableMemoryOptions: [{ value: 2048, text: '2 GB' }],
          availableVersionOptions: [],
          formValues: {},
          isError: true
        })
      })

      test('View context values should have lowest priority', () => {
        const mockRequest = buildMockRequest({
          source: {
            context: {
              availableMemoryOptions: [{ value: 3072, text: '3 GB' }]
            }
          }
        })

        provideFormContextValues(mockRequest, mockResponseToolkit)

        expect(mockRequest.response?.source?.context).toEqual({
          availableMemoryOptions: [{ value: 3072, text: '3 GB' }],
          availableVersionOptions: [],
          formValues: {}
        })
      })
    })

    test('Source return expected mock response tool kit continue value', () => {
      expect(
        provideFormContextValues(buildMockRequest(), mockResponseToolkit)
      ).toEqual('mockContinue')
    })
  })
})
