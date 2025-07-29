import { sanitiseUser } from './sanitise-user.js'
import { noValue } from '../../constants/no-value.js'

describe('#sanitiseUser', () => {
  test('Should provide expected sanitized user from no input', () => {
    expect(sanitiseUser()).toEqual(noValue)
  })

  test('Should provide expected sanitized user from "null" input', () => {
    expect(sanitiseUser(null)).toEqual(noValue)
  })

  test('Should provide expected sanitized user from "n/a" input', () => {
    expect(sanitiseUser('n/a')).toEqual(noValue)
  })

  test('Should provide expected pass through', () => {
    expect(sanitiseUser('Hipgnosis')).toBe('Hipgnosis')
  })
})
