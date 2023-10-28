import { removeHost } from '~/src/server/common/helpers/remove-host'

describe('#removeHost', () => {
  test('Should remove host from url', () => {
    expect(removeHost('https://superawesome.com/best/page/ever')).toEqual(
      'best/page/ever'
    )
  })

  describe('When url is falsey', () => {
    test('Should provide "null"', () => {
      expect(removeHost(undefined)).toBeNull()
      expect(removeHost(null)).toBeNull()
      expect(removeHost()).toBeNull()
      expect(removeHost(false)).toBeNull()
      expect(removeHost(0)).toBeNull()
    })
  })
})
