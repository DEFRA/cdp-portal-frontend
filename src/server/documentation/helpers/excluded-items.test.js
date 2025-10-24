import { shouldExcludedItem } from './excluded-items.js'

describe('#shouldExcludedItem', () => {
  test('Should return true for excluded files', () => {
    expect(shouldExcludedItem('nav.md')).toBe(true)
    expect(shouldExcludedItem('blog-nav.md')).toBe(true)
  })

  test('Should return true for paths starting with excluded paths', () => {
    expect(shouldExcludedItem('blog/post.md')).toBe(true)
    expect(shouldExcludedItem('blog/2023/article.md')).toBe(true)
  })

  test('Should return false for files not in excluded files', () => {
    expect(shouldExcludedItem('index.md')).toBe(false)
    expect(shouldExcludedItem('about.md')).toBe(false)
  })

  test('Should return false for paths not starting with excluded paths', () => {
    expect(shouldExcludedItem('docs/post.md')).toBe(false)
    expect(shouldExcludedItem('articles/2023/blog.md')).toBe(false)
  })

  test('Should handle empty string input', () => {
    expect(shouldExcludedItem('')).toBe(false)
  })
})
