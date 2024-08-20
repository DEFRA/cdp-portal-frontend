import { config } from '~/src/config'

import { createServer } from '~/src/server'

async function startServer() {
  const server = await createServer()
  await server.start()

  server.logger.info('Server started successfully')
  server.logger.info(
    `Access your frontend on http://localhost:${config.get('port')}`
  )
  return server
}

export { startServer }
