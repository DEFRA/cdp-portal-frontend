import jwt from '@hapi/jwt'
import hapiBell from '@hapi/bell'

import { config } from '~/src/config'
import { fetchTeams } from '~/src/server/teams/helpers/fetch'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { proxyFetch } from '~/src/server/common/helpers/fetch/proxy-fetch'
import { proxyAgent } from '~/src/server/common/helpers/fetch/proxy-agent'

async function provideCdpGroups(groups = []) {
  const { teams: teamsWithGithub } = await fetchTeams(true)
  const teamIds = teamsWithGithub?.map((team) => team.teamId)

  return groups.slice().filter((group) => teamIds.includes(group))
}

/**
 * Provide proxyAgent to bell internal http client utils, Wreck
 * @param bell
 * @returns bell
 */
function setupBell(bell) {
  const proxy = proxyAgent()

  if (proxy?.agent) {
    bell.oauth.v2({
      wreck: {
        agents: {
          https: proxy.agent,
          http: proxy.agent,
          httpsAllowUnauthorized: proxy.agent
        }
      }
    })
  }

  return bell
}

const azureOidc = {
  plugin: {
    name: 'azure-oidc',
    register: async (server) => {
      await server.register(setupBell(hapiBell))

      const oidc = await proxyFetch(
        config.get('oidcWellKnownConfigurationUrl')
      ).then((res) => res.json())

      const authCallbackUrl = config.get('appBaseUrl') + '/auth/callback'

      // making the OIDC config available to server
      server.app.oidc = oidc

      server.auth.strategy('azure-oidc', 'bell', {
        location: (request) => {
          if (request.info.referrer) {
            request.yar.flash(sessionNames.referrer, request.info.referrer)
          }

          return authCallbackUrl
        },
        provider: {
          name: 'azure-oidc',
          protocol: 'oauth2',
          useParamsAuth: true,
          auth: oidc.authorization_endpoint,
          token: oidc.token_endpoint,
          scope: [
            `api://${config.get('azureClientId')}/cdp.user`,
            'openid',
            'profile',
            'email',
            'offline_access',
            'user.read'
          ],
          profile: async function (credentials) {
            const payload = jwt.token.decode(credentials.token).decoded.payload
            const groups = await provideCdpGroups(payload.groups)

            credentials.profile = {
              id: payload.oid,
              displayName: payload.name,
              email: payload.upn ?? payload.preferred_username,
              groups,
              loginHint: payload.login_hint
            }
          }
        },
        password: config.get('sessionCookiePassword'),
        clientId: config.get('azureClientId'),
        forceHttps: config.get('isProduction'),
        clientSecret: config.get('azureClientSecret'),
        cookie: 'bell-azure-oidc',
        isSecure: config.get('isProduction'),
        config: {
          tenant: config.get('azureTenantId')
        }
      })
    }
  }
}

export { azureOidc }
