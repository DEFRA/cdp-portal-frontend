import { describe, expect, test } from 'vitest'
import { removeUrlParts } from './remove-url-parts.js'

describe('#removeUrlParts', () => {
  test('Should remove host from url', () => {
    expect(removeUrlParts('https://superawesome.com/best/page/ever')).toBe(
      'best/page/ever'
    )
  })

  test('Should remove host and first part of path from url', () => {
    expect(removeUrlParts('https://superawesome.com/best/page/ever', 4)).toBe(
      'page/ever'
    )
  })

  describe('When url is falsey', () => {
    test('Should provide "null"', () => {
      expect(removeUrlParts(undefined)).toBeNull()
      expect(removeUrlParts(null)).toBeNull()
      expect(removeUrlParts()).toBeNull()
      expect(removeUrlParts(false)).toBeNull()
      expect(removeUrlParts(0)).toBeNull()
    })
  })
})
