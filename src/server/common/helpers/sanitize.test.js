import { sanitize } from '~/src/server/common/helpers/sanitize'

describe('#sanitize', () => {
  test('Should sanitize string as expected', () => {
    expect(sanitize(`the "snail" ate some 'kale'`)).toBe(
      'the snail ate some kale'
    )
  })
})
