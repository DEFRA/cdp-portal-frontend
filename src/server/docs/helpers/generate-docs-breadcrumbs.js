import path from 'node:path'

export function generateDocsBreadcrumbs(docsPath) {
  let basepath = '/docs'
  const breadcrumbs = [
    {
      text: 'Docs',
      href: basepath
    }
  ]

  if (docsPath.length === 0) return breadcrumbs

  docsPath.split('/').forEach((p) => {
    basepath = path.join(basepath, p)
    breadcrumbs.push({
      text: p,
      href: basepath
    })
  })

  return breadcrumbs
}
