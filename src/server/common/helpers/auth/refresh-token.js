import fetch from 'node-fetch'

import { appConfig } from '~/src/config'
import { sessionNames } from '~/src/server/common/constants/session-names'

async function refreshAccessToken(request) {
  const yar = request.yar
  const user = yar.get(sessionNames.user)
  const refreshToken = user?.refreshToken ?? null
  const azureTenantId = appConfig.get('azureTenantId')
  const azureClientId = appConfig.get('azureClientId')
  const azureClientSecret = appConfig.get('azureClientSecret')

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
