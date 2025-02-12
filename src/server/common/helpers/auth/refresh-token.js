import qs from 'qs'
import Wreck from '@hapi/wreck'

import { config } from '~/src/config/config.js'

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

  return await Wreck.post(request.server.app.oidc.token_endpoint, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache'
    },
    payload: qs.stringify(params)
  })
}

export { refreshAccessToken }
