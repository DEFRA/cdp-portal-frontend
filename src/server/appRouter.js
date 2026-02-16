import { glob } from 'glob'
import { posix, parse, resolve } from 'node:path'

export default {
  name: 'appRouter',
  version: '0.0.1',
  register: async function (server, options) {
    const { path, templatesPath } = options

    const sourcePaths = await glob(`${path}/**/route.js`)
    for (const sourcePath of sourcePaths) {
      await registerPage(path, templatesPath, sourcePath, server)
    }
  }
}

async function registerPage(path, templatesPath, sourcePath, server) {
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

  const route = await import(resolve(sourcePath))

  const { dir: routeDirectory } = parse(sourcePath)
  const basePath = routeDirectory.replace(path, '')
  const rawRoutePath = posix.join('/', basePath)
  const routePath = rawRoutePath.replaceAll('...', '*').replaceAll('~', '?')

  for (const method of ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS']) {
    if (route[method]) {
      server.route({
        method,
        path: routePath,
        handler: route[method],
        options: { ...route.options, ...route[method].options }
      })
    }
  }

  if (route.default && !route.GET) {
    const rawViewPath = `${routeDirectory.replace(templatesPath, '')}/page`
    const viewPath =
      rawViewPath.charAt(0) === '/' ? rawViewPath.substr(1) : rawViewPath

    server.route({
      method: 'GET',
      path: routePath,
      handler: async (request, h) => {
        const data = await route.default(request, h)
        return h.view(viewPath, data)
      },
      options: { ...route.options, ...route.default.options }
    })
  }
}
