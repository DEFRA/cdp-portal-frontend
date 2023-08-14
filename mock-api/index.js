const jsonServer = require('json-server')

const api = require('./api')
const port = 3004

const server = jsonServer.create()
const router = jsonServer.router(api)
const middlewares = jsonServer.defaults()

// Custom routes
server.use(
  jsonServer.rewriter({
    '/mock-api/deployments/snd?service=:service':
      '/mock-api/deployments?service_like=:service&environment=snd',
    '/mock-api/deployments/management?service=:service':
      '/mock-api/deployments?service_like=:service&environment=management',

    '/mock-api/deployments/snd?user=:user':
      '/mock-api/deployments?user_like=:user&environment=snd',
    '/mock-api/deployments/management?user=:user':
      '/mock-api/deployments?user_like=:user&environment=management',

    '/mock-api/deployments/snd?status=:status':
      '/mock-api/deployments?status_like=:status&environment=snd',
    '/mock-api/deployments/management?status=:status':
      '/mock-api/deployments?status_like=:status&environment=management',

    '/mock-api/deployments/snd?service=:service&user=:user&status=:status':
      '/mock-api/deployments?service_like=:service&user_like=:use&status_like=:status&environment=snd',
    '/mock-api/deployments/management?service=:service&user=:user&status=:status':
      '/mock-api/deployments?service_like=:service&user_like=:user&status_like=:status&environment=management',

    '/mock-api/deployments/:environment':
      '/mock-api/deployments?environment=:environment'
  })
)

server.use(middlewares)
server.use('/mock-api', router)

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Mock JSON server started on http://localhost:${port}/mock-api`)
})
