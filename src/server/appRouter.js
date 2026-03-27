import glob from 'fast-glob'
import { posix, parse, resolve, join } from 'node:path'

// TODO: Lift up to Libraries project
export default {
  name: 'appRouter',
  version: '0.0.1',
  description: 'Filesystem based routing',
  register: async function (server, options) {
    const { path, templatesPath } = options

    const sourceStream = glob.stream([join(path, '**/route.js')], {
      absolute: false,
      objectMode: true
    })

    for await (const { path: sourcePath } of sourceStream) {
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

  server.register({
    name: routePath.replaceAll('/', '-'),
    register: async function (pluginServer) {
      pluginServer.ext(route.ext ?? [])

      for (const method of [
        'GET',
        'POST',
        'PATCH',
        'PUT',
        'DELETE',
        'OPTIONS'
      ]) {
        if (route[method]) {
          pluginServer.route({
            method,
            path: routePath,
            handler: route[method],
            options: {
              ...route.options,
              ...(route?.options?.id
                ? { id: `${method}:${route.options.id}` }
                : {}),
              ...route[method].options
            }
          })
        }
      }

      if (route.default && !route.GET) {
        const rawViewPath = `${routeDirectory.replace(templatesPath, '')}/page`
        const viewPath =
          rawViewPath.charAt(0) === '/' ? rawViewPath.substr(1) : rawViewPath

        pluginServer.route({
          method: 'GET',
          path: routePath,
          handler: async (request, h) => {
            const data = await route.default(request, h)
            return h.view(viewPath, data)
          },
          options: {
            ...route.options,
            ...route.default.options
          }
        })
      }
    }
  })
}
