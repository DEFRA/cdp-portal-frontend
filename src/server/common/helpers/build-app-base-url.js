import { appConfig } from '~/src/config'

function buildAppBaseUrl(server) {
  const isDevelopment = appConfig.get('isDevelopment')

  return (
    server.info.protocol +
    '://' +
    server.info.host +
    `${isDevelopment ? ':' + server.info.port : ''}`
  )
}

export { buildAppBaseUrl }
