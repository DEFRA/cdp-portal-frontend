import path from 'node:path'

export function generateDocsBreadcrumbs(docsPath) {
  let basepath = '/docs'
  const breadcrumbs = [
    {
      text: 'Docs',
      href: basepath
    }
  ]

  docsPath.split('/').forEach((p) => {
    if (p !== '') {
      basepath = path.join(basepath, p)
      breadcrumbs.push({
        text: p,
        href: basepath
      })
    }
  })

  return breadcrumbs
}
