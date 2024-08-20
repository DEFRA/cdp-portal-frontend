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
          get: () => ({ user: 'Dolly the sheep session' }),
          flash: () => [
            {
              formValues: {
                user: 'Dolly the sheep validation failure flash'
              }
            }
          ],
          source: {
            context: {
              formValues: {
                user: 'Dolly the sheep context'
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
            user: 'Dolly the sheep validation failure flash'
          },
          isError: true
        })
      })

      test('Session values should have medium priority', () => {
        const mockRequest = buildMockRequest({
          get: () => ({ user: 'Postman Pat session' }),
          source: {
            context: {
              formValues: {
                user: 'Postman Pat context'
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
            user: 'Postman Pat session'
          }
        })
      })

      test('View context values should have lowest priority', () => {
        const mockRequest = buildMockRequest({
          source: {
            context: {
              formValues: {
                user: 'Bagpuss context'
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
            user: 'Bagpuss context'
          }
        })
      })
    })

    describe('Form values without session value', () => {
      test('Validation failure flash values should have highest priority', () => {
        const mockRequest = buildMockRequest({
          flash: () => [
            {
              formValues: {
                user: 'Pepper pig validation failure flash'
              }
            }
          ],
          source: {
            context: {
              formValues: {
                user: 'Pepper pig context'
              }
            }
          }
        })

        provideFormContextValues()(mockRequest, mockResponseToolkit)

        expect(mockRequest.response?.source?.context).toEqual({
          formValues: {
            user: 'Pepper pig validation failure flash'
          },
          isError: true
        })
      })

      test('View context values should have lowest priority', () => {
        const mockRequest = buildMockRequest({
          source: {
            context: {
              formValues: {
                user: 'Pepper pig context'
              }
            }
          }
        })

        provideFormContextValues()(mockRequest, mockResponseToolkit)

        expect(mockRequest.response?.source?.context).toEqual({
          formValues: {
            user: 'Pepper pig context'
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
      ).toBe('mockContinue')
    })
  })
})
