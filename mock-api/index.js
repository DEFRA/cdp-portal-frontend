const jsonServer = require('json-server')

const api = require('./api')

const index = jsonServer.create()
const router = jsonServer.router(api)
const middlewares = jsonServer.defaults()

index.use(middlewares)
index.use('/mock-api', router)

index.listen(3004, () => {
  console.log('Mock JSON server started')
})
