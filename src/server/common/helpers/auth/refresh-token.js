import fetch from 'node-fetch'

import { config } from '~/src/config'

async function refreshAccessToken(request) {
  const authedUser = await request.getUserSession()
  const refreshToken = authedUser?.refreshToken ?? null
  const azureTenantId = config.get('azureTenantId')
  const azureClientId = config.get('azureClientId')
  const azureClientSecret = config.get('azureClientSecret')

  const params = new URLSearchParams()

  params.append('client_id', azureClientId)
  params.append('client_secret', azureClientSecret)
  params.append('grant_type', 'refresh_token')
  params.append('refresh_token', refreshToken)
  params.append('scope', `api://${azureClientId}/cdp.user`)

  request.logger.info('Azure OIDC access token expired, refreshing...')

  return await fetch(
    `https://login.microsoftonline.com/${azureTenantId}/oauth2/v2.0/token`,
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache'
      },
      body: params
    }
  )
}

export { refreshAccessToken }
