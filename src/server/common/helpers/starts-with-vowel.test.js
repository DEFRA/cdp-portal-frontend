import { startsWithVowel } from '~/src/server/common/helpers/starts-with-vowel'

describe('#startsWithVowel', () => {
  test('When string starts with vowel should return true', () => {
    expect(startsWithVowel('Apple')).toEqual(true)
  })

  test('When does not string starts with vowel should return false', () => {
    expect(startsWithVowel('Monkey')).toEqual(false)
  })
})
