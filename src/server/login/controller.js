import { config } from '~/src/config'

const loginController = {
  options: {
    auth: 'azure-oidc'
  },
  handler: async (request, h) => h.redirect(config.get('appPathPrefix'))
}

export { loginController }
