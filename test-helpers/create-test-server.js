import hapi from '@hapi/hapi'

/**
 * Creates a lightweight Hapi server for testing individual routes.
 * This is much faster and uses less memory than the full server.
 *
 * @param {object} options
 * @param {object|object[]} options.routes - Route definition(s) { method, path, ...controller }
 * @returns {Promise<import('@hapi/hapi').Server>}
 *
 * @example
 * // Single route
 * const server = await createTestServer({
 *   routes: { method: 'GET', path: '/health', ...healthController }
 * })
 *
 * @example
 * // Multiple routes
 * const server = await createTestServer({
 *   routes: [
 *     { method: 'GET', path: '/health', ...healthController },
 *     { method: 'GET', path: '/status', ...statusController }
 *   ]
 * })
 */
async function createTestServer({ routes }) {
  const routeArray = Array.isArray(routes) ? routes : [routes]

  const server = hapi.server({
    port: 0,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    }
  })

  for (const route of routeArray) {
    server.route({
      method: route.method,
      path: route.path,
      options: route.options,
      handler: route.handler
    })
  }

  await server.initialize()

  return server
}

export { createTestServer }
