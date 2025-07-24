import { describe, expect, test } from 'vitest'
import { docsBreadcrumbs } from './docs-breadcrumbs.js'

describe('#docsBreadcrumbs', () => {
  test('Should return expected documentation breadcrumbs for a single file path named "README.md', () => {
    const result = docsBreadcrumbs('README.md')
    expect(result).toEqual([
      { text: 'CDP', href: '/documentation' },
      { text: 'Documentation' }
    ])
  })

  test('Should return expected documentation breadcrumbs for a single file path', () => {
    const result = docsBreadcrumbs('introduction.md')
    expect(result).toEqual([
      { text: 'CDP', href: '/documentation' },
      { text: 'Introduction' }
    ])
  })

  test('Should return expected documentation for a nested file path', () => {
    const result = docsBreadcrumbs('guides/getting-started.md')
    expect(result).toEqual([
      { text: 'CDP', href: '/documentation' },
      { text: 'Guides', href: '/documentation/guides/guides.md' },
      { text: 'Getting Started' }
    ])
  })

  test('Should handle folder files correctly', () => {
    const result = docsBreadcrumbs('guides/guides.md')
    expect(result).toEqual([
      { text: 'CDP', href: '/documentation' },
      { text: 'Guides' }
    ])
  })

  test('Should handle paths with multiple segments', () => {
    const result = docsBreadcrumbs('guides/advanced/topics.md')
    expect(result).toEqual([
      { text: 'CDP', href: '/documentation' },
      { text: 'Guides', href: '/documentation/guides/guides.md' },
      { text: 'Advanced', href: '/documentation/guides/advanced/advanced.md' },
      { text: 'Topics' }
    ])
  })

  test('Should handle paths with different cases correctly', () => {
    const result = docsBreadcrumbs('Guides/Advanced/Topics.md')
    expect(result).toEqual([
      { text: 'CDP', href: '/documentation' },
      { text: 'Guides', href: '/documentation/Guides/Guides.md' },
      { text: 'Advanced', href: '/documentation/Guides/Advanced/Advanced.md' },
      { text: 'Topics' }
    ])
  })
})
