import { sanitizeUser } from '~/src/server/common/helpers/sanitize-user'
import { noValue } from '~/src/server/common/constants/no-value'

describe('#sanitizeUser', () => {
  test('Should provide expected sanitized user from no input', () => {
    expect(sanitizeUser()).toEqual(noValue)
  })

  test('Should provide expected sanitized user from "null" input', () => {
    expect(sanitizeUser(null)).toEqual(noValue)
  })

  test('Should provide expected sanitized user from "n/a" input', () => {
    expect(sanitizeUser('n/a')).toEqual(noValue)
  })

  test('Should provide expected pass through', () => {
    expect(sanitizeUser('Hipgnosis')).toEqual('Hipgnosis')
  })
})
