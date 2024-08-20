import { pluralise } from '~/src/server/common/helpers/pluralise'

describe('#pluralise', () => {
  test('When zero, Should make word plural', () => {
    expect(pluralise('Apple', 0)).toBe('Apples')
  })

  test('With a lot of monkeys, Should make word plural', () => {
    expect(pluralise('Monkey', 10)).toBe('Monkeys')
  })

  test('Should not make word plural', () => {
    expect(pluralise('Pear', 1)).toBe('Pear')
  })

  test('When a word contains a vowel, Should make word plural', () => {
    expect(pluralise('City', 3)).toBe('Cities')
  })
})
