import { statusCodeMessage } from '~/src/server/common/helpers/errors/status-code-message'

describe('#statusCodeMessage', () => {
  test('Should provide expected Not Found message', () => {
    expect(statusCodeMessage(404)).toBe('Page not found')
  })

  test('Should provide expected Forbidden message', () => {
    expect(statusCodeMessage(403)).toBe('Forbidden')
  })

  test('Should provide expected Unauthorized message', () => {
    expect(statusCodeMessage(401)).toBe('Unauthorized')
  })

  test('Should provide expected Bad Request message', () => {
    expect(statusCodeMessage(400)).toBe('Bad Request')
  })

  test('Should provide expected default message', () => {
    expect(statusCodeMessage(500)).toBe('Something went wrong')
  })
})
