import { headingToAnchor } from './heading-anchor.js'

describe('#headingToAnchor', () => {
  test('Should lowercase text', () => {
    expect(headingToAnchor('Introduction')).toBe('introduction')
  })

  test('Should replace spaces with dashes', () => {
    expect(headingToAnchor('Getting Started')).toBe('getting-started')
  })

  test('Should replace multiple consecutive non-word characters with a single dash', () => {
    expect(headingToAnchor('44: All the things')).toBe('44-all-the-things')
  })

  test('Should strip leading dashes caused by non-word characters at the start', () => {
    expect(headingToAnchor('(Intro)')).toBe('intro')
  })

  test('Should strip trailing dashes caused by non-word characters at the end', () => {
    expect(headingToAnchor('Intro!')).toBe('intro')
  })

  test('Should strip both leading and trailing dashes', () => {
    expect(headingToAnchor('(Intro!)')).toBe('intro')
  })

  test('Should handle text with internal punctuation correctly', () => {
    expect(headingToAnchor('foo: bar (baz)')).toBe('foo-bar-baz')
  })
})
