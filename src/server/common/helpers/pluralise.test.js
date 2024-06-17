import { pluralise } from '~/src/server/common/helpers/pluralise'

describe('#pluralise', () => {
  test('When zero, Should make word plural', () => {
    expect(pluralise('Apple', 0)).toEqual('Apples')
  })

  test('With a lot of monkeys, Should make word plural', () => {
    expect(pluralise('Monkey', 10)).toEqual('Monkeys')
  })

  test('Should not make word plural', () => {
    expect(pluralise('Pear', 1)).toEqual('Pear')
  })

  test('When a word contains a vowel, Should make word plural', () => {
    expect(pluralise('City', 3)).toEqual('Cities')
  })
})
