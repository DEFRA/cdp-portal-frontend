import startCase from 'lodash/startCase.js'

function docsBreadcrumbs(docsPath) {
  const breadcrumbs = [
    {
      text: 'Documentation',
      href: '/documentation'
    }
  ]

  const pathParts = docsPath.split('/')

  if (pathParts.at(-1)?.toLowerCase() === 'readme.md') {
    pathParts.pop()
  }

  if (pathParts.length === 1) {
    breadcrumbs.push({
      text: startCase(pathParts.at(0).replace('.md', ''))
    })

    return breadcrumbs
  }

  pathParts.forEach((pathPart, i, array) => {
    if (i === pathParts.length - 1) {
      // Last breadcrumb is not linkable
      breadcrumbs.push({
        text: startCase(pathPart.replace('.md', ''))
      })
    } else {
      const path = array.slice(0, i + 1).join('/')

      breadcrumbs.push({
        text: startCase(pathPart),
        href: `/documentation/${path}/README.md`
      })
    }
  })

  return breadcrumbs
}

export { docsBreadcrumbs }
