import { glob } from 'glob'
import { posix, parse } from 'node:path'

export default {
  name: 'pagesRouter',
  version: '0.0.1',
  register: async function (server, options) {
    const pagesPath = 'src/server/pages'
    const importPaths = await glob(`${pagesPath}/**/*.{js,ts}`)

    for (const importPath of importPaths) {
      await registerPage(pagesPath, importPath, server)
    }
  }
}

async function registerPage(pagesPath, sourcePath, server) {
  const page = await import(sourcePath)

  const { name: pageName, dir: pageDirectory } = parse(sourcePath)
  const basePath = pageDirectory.replace(pagesPath, '')
  const routePath = posix.join(
    '/',
    basePath,
    pageName === 'index' ? '' : pageName
  )

  for (const method of ['GET', 'POST', 'PATCH', 'DELETE']) {
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
    server.route({
      method: 'GET',
      path: routePath,
      handler: async (request, h) => {
        const data = await page.default(request, h)
        return h.view('pages/test', data)
      },
      options: { ...page.options, ...page.default.options }
    })
  }
}
