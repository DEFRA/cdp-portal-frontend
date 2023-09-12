import { appConfig } from '~/src/config'

const loginController = {
  options: {
    auth: 'azure-oidc'
  },
  handler: (request, h) => {
    request.yar.set('auth', request.auth)
    return h.redirect(appConfig.get('appPathPrefix'))
  }
}

export { loginController }
