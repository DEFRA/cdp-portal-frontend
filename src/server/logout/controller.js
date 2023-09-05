import { appConfig } from '~/src/config'

const logoutController = {
  handler: (request, h) => {
    const logoutUrl = `https://login.microsoftonline.com/${appConfig.get(
      'azureTenantId'
    )}/oauth2/logout?post_logout_redirect_uri=${encodeURIComponent(
      appConfig.get('appPathPrefix')
    )}`
    request.yar.clear('auth')
    return h.redirect(logoutUrl)
  }
}

export { logoutController }
