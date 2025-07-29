import { pluralise } from './pluralise.js'

describe('#pluralise', () => {
  test('When zero, should make word plural', () => {
    expect(pluralise('Apple', 0)).toBe('Apples')
  })

  test('When no count passed, should make word plural', () => {
    expect(pluralise('Apple')).toBe('Apples')
  })

  test('With a lot of monkeys, should make word plural', () => {
    expect(pluralise('Monkey', 10)).toBe('Monkeys')
  })

  test('Should not make word plural', () => {
    expect(pluralise('Pear', 1)).toBe('Pear')
  })

  test('When a word contains a vowel, should make word plural', () => {
    expect(pluralise('City', 3)).toBe('Cities')
  })

  test('When no word passed, should return undefined', () => {
    expect(pluralise(undefined, 3)).toBeUndefined()
  })
})
