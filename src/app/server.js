import path from 'path'
import hapi from '@hapi/hapi'
import { plugin as basicAuth } from '@hapi/basic'

import { appConfig } from '~/src/config'
import { nunjucksConfig } from '~/src/config/nunjucks'
import { router } from './router'
import { requestLogger } from '~/src/app/common/helpers/request-logger'
import { catchAll } from '~/src/app/common/helpers/errors'
import { flashMessage } from '~/src/app/common/helpers/flash-message'
import { addNotificationsToContext } from '~/src/app/common/helpers/add-notifications-to-context'
import { validateBasicAuth } from '~/src/app/common/helpers/basic-auth'

async function createServer() {
  const server = hapi.server({
    port: appConfig.get('port'),
    routes: {
      cors: true,
      validate: {
        options: {
          abortEarly: false
        }
      },
      files: {
        relativeTo: path.resolve(appConfig.get('root'), '.public')
      }
    },
    router: {
      stripTrailingSlash: true
    }
  })

  if (appConfig.get('isProduction') === true) {
    await server.register(basicAuth)

    server.auth.strategy('simple', 'basic', { validate: validateBasicAuth })
    server.auth.default('simple')
  }

  server.ext('onPreResponse', addNotificationsToContext, {
    before: ['yar']
  })

  await server.register(flashMessage)

  await server.register(requestLogger)

  await server.register(router, {
    routes: { prefix: appConfig.get('appPathPrefix') }
  })

  await server.register(nunjucksConfig)

  server.ext('onPreResponse', catchAll)

  return server
}

export { createServer }
