import { docsBreadcrumbs } from '~/src/server/documentation/helpers/docs-breadcrumbs.js'

describe('#docsBreadcrumbs', () => {
  test('Should return expected documentation breadcrumbs for a single file path', () => {
    const result = docsBreadcrumbs('introduction.md')
    expect(result).toEqual([
      { text: 'Documentation', href: '/documentation' },
      { text: 'Introduction' }
    ])
  })

  test('Should return expected documentation for a nested file path', () => {
    const result = docsBreadcrumbs('guides/getting-started.md')
    expect(result).toEqual([
      { text: 'Documentation', href: '/documentation' },
      { text: 'Guides', href: '/documentation/guides/README.md' },
      { text: 'Getting Started' }
    ])
  })

  test('Should handle README.md files correctly', () => {
    const result = docsBreadcrumbs('guides/README.md')
    expect(result).toEqual([
      { text: 'Documentation', href: '/documentation' },
      { text: 'Guides' }
    ])
  })

  test('Should handle paths with multiple segments', () => {
    const result = docsBreadcrumbs('guides/advanced/topics.md')
    expect(result).toEqual([
      { text: 'Documentation', href: '/documentation' },
      { text: 'Guides', href: '/documentation/guides/README.md' },
      { text: 'Advanced', href: '/documentation/guides/advanced/README.md' },
      { text: 'Topics' }
    ])
  })
})
