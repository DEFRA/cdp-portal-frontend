import { glob } from 'glob'
import { posix, parse, resolve } from 'node:path'

export default {
  name: 'pagesRouter',
  version: '0.0.1',
  register: async function (server, options) {
    const { pagesPath, templatesPath } = options

    const sourcePaths = await glob(`${pagesPath}/**/page.js`)
    for (const sourcePath of sourcePaths) {
      await registerPage(pagesPath, templatesPath, sourcePath, server)
    }
  }
}

async function registerPage(pagesPath, templatesPath, sourcePath, server) {
  if (sourcePath.includes('*')) {
    throw new Error(
      `Use '...' rather than Hapi's '*' in route '${sourcePath}'. This is for Windows FS compatibility.`
    )
  }

  if (sourcePath.includes('?')) {
    throw new Error(
      `Use '~' rather than Hapi's '?' in route '${sourcePath}'. This is for Windows FS compatibility.`
    )
  }

  const page = await import(resolve(sourcePath))

  const { dir: pageDirectory } = parse(sourcePath)
  const basePath = pageDirectory.replace(pagesPath, '')
  const rawRoutePath = posix.join('/', basePath)
  const routePath = rawRoutePath.replaceAll('...', '*').replaceAll('~', '?')

  for (const method of ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS']) {
    if (page[method]) {
      server.route({
        method,
        path: routePath,
        handler: page[method],
        options: { ...page.options, ...page[method].options }
      })
    }
  }

  if (page.default && !page.GET) {
    const rawViewPath = `${pageDirectory.replace(templatesPath, '')}/page`
    const viewPath =
      rawViewPath.charAt(0) === '/' ? rawViewPath.substr(1) : rawViewPath

    server.route({
      method: 'GET',
      path: routePath,
      handler: async (request, h) => {
        const data = await page.default(request, h)
        return h.view(viewPath, data)
      },
      options: { ...page.options, ...page.default.options }
    })
  }
}
