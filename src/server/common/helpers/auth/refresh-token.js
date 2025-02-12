import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function refreshAccessToken(request) {
  const authedUser = await request.getUserSession()
  const refreshToken = authedUser?.refreshToken ?? null
  const azureClientId = config.get('azureClientId')
  const azureClientSecret = config.get('azureClientSecret')
  const params = {
    client_id: azureClientId,
    client_secret: azureClientSecret,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    scope: `api://${azureClientId}/cdp.user openid profile email offline_access user.read`
  }

  request.logger.debug('Azure OIDC access token expired, refreshing...')

  return await fetcher(request.server.app.oidc.token_endpoint, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache'
    },
    payload: params
  })
}

export { refreshAccessToken }
