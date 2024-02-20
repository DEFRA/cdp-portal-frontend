import { throwHttpError } from '~/src/server/common/helpers/fetch/throw-http-error'

describe('#throwHttpError', () => {
  const mockJson = {
    message: 'Something terrible has happened!'
  }
  const mockResponse = {
    statusText: 'Oh dear!',
    status: 408
  }

  test('Should throw with json error message', () => {
    expect.assertions(2)

    try {
      throwHttpError(mockJson, mockResponse)
    } catch (error) {
      expect(error.output.statusCode).toEqual(408)
      expect(error).toHaveProperty(
        'message',
        'Something terrible has happened!'
      )
    }
  })

  test('Should throw with response statusText', () => {
    expect.assertions(2)

    try {
      throwHttpError({}, mockResponse)
    } catch (error) {
      expect(error.output.statusCode).toEqual(408)
      expect(error).toHaveProperty('message', 'Oh dear!')
    }
  })

  test('Should throw with default status code', () => {
    expect.assertions(2)

    try {
      throwHttpError({}, { statusText: 'Crikey' })
    } catch (error) {
      expect(error.output.statusCode).toEqual(500)
      expect(error).toHaveProperty('message', 'Crikey')
    }
  })
})
