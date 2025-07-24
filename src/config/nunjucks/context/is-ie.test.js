import { describe, expect, test } from 'vitest'
import { isIe } from './is-ie.js'

describe('#isIe', () => {
  test('Should detect IE11', () => {
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko'
    expect(isIe(ua)).toBe(true)
  })

  test('Should detect IE10', () => {
    const ua =
      'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)'
    expect(isIe(ua)).toBe(true)
  })

  test('Should not detect Chrome', () => {
    const ua =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    expect(isIe(ua)).toBe(false)
  })
})
