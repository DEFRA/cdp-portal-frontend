import { startsWithVowel } from './starts-with-vowel.js'

describe('#startsWithVowel', () => {
  test('When string starts with vowel should return true', () => {
    expect(startsWithVowel('Apple')).toBe(true)
  })

  test('When does not string starts with vowel should return false', () => {
    expect(startsWithVowel('Monkey')).toBe(false)
  })
})
