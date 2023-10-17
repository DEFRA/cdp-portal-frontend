import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values'

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
  const mockSessionName = 'mock-user'
  const mockResponseToolkit = {
    continue: 'mockContinue'
  }

  describe('When variety is not "view"', () => {
    test('Source context should not be set', () => {
      const mockRequest = buildMockRequest({ variety: 'plain' })
      provideFormContextValues(mockSessionName)(
        mockRequest,
        mockResponseToolkit
      )

      expect(mockRequest.response?.source?.context).toBeUndefined()
    })
  })

  describe('When variety is "view"', () => {
    test('Source context should be set', () => {
      const mockRequest = buildMockRequest()
      provideFormContextValues(mockSessionName)(
        mockRequest,
        mockResponseToolkit
      )

      expect(mockRequest.response?.source?.context).toEqual({
        formValues: {}
      })
    })

    describe('Form values', () => {
      test('Validation failure flash values should have highest priority', () => {
        const mockRequest = buildMockRequest({
          get: () => ({ user: 'Dolly the sheep' }),
          flash: () => [
            {
              formValues: {
                user: 'Dolly the sheep'
              }
            }
          ],
          source: {
            context: {
              formValues: {
                user: 'Dolly the sheep'
              }
            }
          }
        })

        provideFormContextValues(mockSessionName)(
          mockRequest,
          mockResponseToolkit
        )

        expect(mockRequest.response?.source?.context).toEqual({
          formValues: {
            user: 'Dolly the sheep'
          },
          isError: true
        })
      })

      test('Session values should have medium priority', () => {
        const mockRequest = buildMockRequest({
          get: () => ({ user: 'Postman Pat' }),
          source: {
            context: {
              formValues: {
                user: 'Postman Pat'
              }
            }
          }
        })

        provideFormContextValues(mockSessionName)(
          mockRequest,
          mockResponseToolkit
        )

        expect(mockRequest.response?.source?.context).toEqual({
          formValues: {
            user: 'Postman Pat'
          }
        })
      })

      test('View context values should have lowest priority', () => {
        const mockRequest = buildMockRequest({
          source: {
            context: {
              formValues: {
                user: 'Bagpuss'
              }
            }
          }
        })

        provideFormContextValues(mockSessionName)(
          mockRequest,
          mockResponseToolkit
        )

        expect(mockRequest.response?.source?.context).toEqual({
          formValues: {
            user: 'Bagpuss'
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
                user: 'Top cat'
              }
            }
          ]
        })

        provideFormContextValues(mockSessionName)(
          mockRequest,
          mockResponseToolkit
        )

        expect(mockRequest.response?.source?.context).toEqual(
          expect.objectContaining({
            isError: true
          })
        )
      })
    })

    test('Source return expected mock response tool kit continue value', () => {
      expect(
        provideFormContextValues(mockSessionName)(
          buildMockRequest(),
          mockResponseToolkit
        )
      ).toEqual('mockContinue')
    })
  })
})
