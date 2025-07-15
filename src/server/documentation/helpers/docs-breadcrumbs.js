import startCase from 'lodash/startCase.js'

function docsBreadcrumbs(docsPath) {
  const breadcrumbs = [
    {
      text: 'CDP',
      href: '/documentation'
    }
  ]

  const pathParts = docsPath.split('/').filter(Boolean)

  pathParts.forEach((pathPart, i, array) => {
    const isLastPart = i === pathParts.length - 1
    const previousPart = array.at(i - 1)?.toLowerCase()
    const currentPart = pathPart.replace('.md', '').toLowerCase()
    const nextPart = array
      .at(i + 1)
      ?.replace('.md', '')
      .toLowerCase()

    if (isLastPart) {
      if (pathParts.length === 1 && pathPart === 'README.md') {
        breadcrumbs.push({
          text: 'Documentation'
        })
      } else if (previousPart !== currentPart) {
        breadcrumbs.push({
          text: startCase(pathPart.replace('.md', ''))
        })
      }
    } else {
      const path = array.slice(0, i + 1).join('/')
      const isNextPartSame = nextPart === currentPart

      breadcrumbs.push({
        text: startCase(pathPart),
        ...(isNextPartSame
          ? {}
          : { href: `/documentation/${path}/${pathPart}.md` })
      })
    }
  })

  return breadcrumbs
}

export { docsBreadcrumbs }
