import jsonServer from 'json-server'
import api from './api.js'

const port = 3004
const server = jsonServer.create()
const router = jsonServer.router(api)
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use('/mock-api', router)

/*

Date format = day-month-year

query params:
from
to
environments


/costs
/costs/servicecode/{serviceCode}
*/

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Mock JSON server started on http://localhost:${port}/mock-api`)
})
