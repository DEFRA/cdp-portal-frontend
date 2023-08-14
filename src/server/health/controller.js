import { appConfig } from '~/src/config'

const healthController = {
  ...(appConfig.get('isProduction') === true && {
    options: { auth: { mode: 'optional' } }
  }),
  handler: (request, h) => h.response({ message: 'success' }).code(200)
}

export { healthController }
