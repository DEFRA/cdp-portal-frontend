import { generateDocsBreadcrumbs } from '~/src/server/docs/helpers/generate-docs-breadcrumbs'

describe('#generateDocBreadcrumbs', () => {
  test('generates breadcrumbs for path', () => {
    const breadcrumbs = generateDocsBreadcrumbs('dir/subdir/file.md')

    expect(breadcrumbs).toEqual([
      { href: '/docs', text: 'Docs' },
      { href: '/docs/dir', text: 'dir' },
      { href: '/docs/dir/subdir', text: 'subdir' },
      { href: '/docs/dir/subdir/file.md', text: 'file.md' }
    ])
  })

  test('links to default file when no path is given', () => {
    const breadcrumbs = generateDocsBreadcrumbs('')
    expect(breadcrumbs).toEqual([{ href: '/docs', text: 'Docs' }])
  })
})
