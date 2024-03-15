import { throwHttpError } from '~/src/server/common/helpers/fetch/throw-http-error'
import { getErrorSync, NoErrorThrownError } from '~/test-helpers/get-error'

describe('#throwHttpError', () => {
  const mockJson = {
    message: 'Something terrible has happened!'
  }
  const mockResponse = {
    statusText: 'Oh dear!',
    status: 408
  }

  test('Should throw with json error message', () => {
    const error = getErrorSync(() => throwHttpError(mockJson, mockResponse))

    expect(error).not.toBeInstanceOf(NoErrorThrownError)
    expect(error).toBeInstanceOf(Error)
    expect(error.output.statusCode).toEqual(408)
    expect(error).toHaveProperty('message', 'Something terrible has happened!')
  })

  test('Should throw with response statusText', () => {
    const error = getErrorSync(() => throwHttpError({}, mockResponse))

    expect(error).not.toBeInstanceOf(NoErrorThrownError)
    expect(error).toBeInstanceOf(Error)
    expect(error.output.statusCode).toEqual(408)
    expect(error).toHaveProperty('message', 'Oh dear!')
  })

  test('Should throw with default status code', () => {
    const error = getErrorSync(() =>
      throwHttpError({}, { statusText: 'Crikey' })
    )

    expect(error).not.toBeInstanceOf(NoErrorThrownError)
    expect(error).toBeInstanceOf(Error)
    expect(error.output.statusCode).toEqual(500)
    expect(error).toHaveProperty('message', 'Crikey')
  })
})
