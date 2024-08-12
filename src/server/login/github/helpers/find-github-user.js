import { config } from '~/src/config'
import { proxyFetch } from '~/src/server/common/helpers/proxy/proxy-fetch'

const clientId = config.get('github.client.id')
const clientSecret = config.get('github.client.secret')

async function findGithubHandle(code, logger) {
  const { access_token } = await exchangeGithubCodeAccessToken(code)
  logger.debug({ access_token }, 'Access token')
  const { login } = await findGithubUser(access_token)
  return login
}

async function findGithubUser(accessToken) {
  if (!accessToken) {
    throw new Error('Access token not found')
  }
  const response = await proxyFetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  })
  if (!response.ok) {
    throw new Error('Failed to get GitHub user')
  }
  return await response.json()
}

async function exchangeGithubCodeAccessToken(code) {
  const params = new URLSearchParams()
  params.append('client_id', clientId)
  params.append('client_secret', clientSecret)
  params.append('code', code)
  const response = await proxyFetch(
    'https://github.com/login/oauth/access_token',
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
        Accept: 'application/json'
      },
      body: params
    }
  )
  if (!response.ok) {
    throw new Error('Failed to get access token')
  }
  return response.json()
}

export { findGithubHandle }
