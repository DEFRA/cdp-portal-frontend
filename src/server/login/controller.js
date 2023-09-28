import { appConfig } from '~/src/config'

const loginController = {
  options: {
    auth: 'azure-oidc'
  },
  handler: async (request, h) => h.redirect(appConfig.get('appPathPrefix'))
}

export { loginController }
