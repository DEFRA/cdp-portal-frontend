import { createServer } from '~/src/app/server'
import { createLogger } from '~/src/common/helpers/logger'

const logger = createLogger()

process.on('unhandledRejection', (error) => {
  logger.info('Unhandled rejection', error)
  process.exit(1)
})

async function startServer() {
  const server = await createServer()

  await server.start()

  server.log(`Server started successfully on ${server.info.uri}`)
}

startServer().catch((error) => {
  logger.error('Server did not start :(', error)
})
