import * as Hoek from '@hapi/hoek'
import * as openid from 'openid-client'
import Joi from 'joi'
import Boom from '@hapi/boom'

import { config } from '../../../../config/config.js'
import { createLogger } from '../logging/logger.js'
import { sessionNames } from '../../constants/session-names.js'
import { asExternalUrl } from '../url/url-helpers.js'
import { refreshTokenIfExpired } from './refresh-token.js'

const logger = createLogger()
const callbackPath = '/auth/callback'

export const federatedOidc = {
  name: 'federatedOidc',
  dependencies: ['federated-credentials'],
  register: function (server) {
    const settings = {
      discoveryUri: config.get('oidcWellKnownConfigurationUrl'),
      redirectUri: config.get('appBaseUrl') + callbackPath,
      clientId: config.get('azureClientId'),
      scope: `api://${config.get('azureClientId')}/cdp.user openid profile email offline_access user.read`,
      tokenProvider: () => server.federatedCredentials.getToken(),
      useMocks: config.get('azureFederatedCredentials.enableMocking')
    }

    server.auth.scheme('federated-oidc', scheme)
    server.auth.strategy('azure-oidc', 'federated-oidc', settings)

    server.ext('onPreAuth', (request, h) =>
      refreshTokenIfExpired(
        (token) => refreshToken(settings, token),
        request,
        h
      )
    )
  }
}

function scheme(_server, options) {
  const settings = Joi.attempt(Hoek.clone(options), optionsSchema)

  return {
    authenticate: async function (request, h) {
      const federatedToken = await settings.tokenProvider()
      const discoveryUrl = new URL(settings.discoveryUri)
      const options = {}

      if (settings.useMocks) {
        // Disable the HTTPS requirements when connecting to the mock.
        // OpenId flags this as deprecated purely to warn that it's not for prod use.

        // noinspection JSDeprecatedSymbols
        options.execute = [openid.allowInsecureRequests]
      }

      const oidcConfig = await openid.discovery(
        discoveryUrl,
        settings.clientId,
        {},
        ClientFederatedCredential(federatedToken),
        options
      )

      const isPreLogin = !request.query.code

      if (isPreLogin) {
        try {
          // User has just started the login flow.
          const redirectTo = await preLogin(request, oidcConfig, settings)
          return h.redirect(redirectTo).takeover()
        } catch (e) {
          logger.error(e, 'PreLogin Federated login failed')
          return Boom.unauthorized(e)
        }
      } else {
        // User has logged in and been redirected back to the auth callback
        try {
          const credentials = await postLogin(request, oidcConfig, settings)
          return h.authenticated({ credentials })
        } catch (e) {
          logger.error(e, 'Post Federated login failed')
          return Boom.unauthorized(e)
        }
      }
    }
  }
}

/**
 * Redirects a user to the AAD login page.
 */
async function preLogin(request, oidcConfig, settings) {
  const codeVerifier = openid.randomPKCECodeVerifier()
  const codeChallenge = await openid.calculatePKCECodeChallenge(codeVerifier)
  let nonce

  const parameters = {
    redirect_uri: settings.redirectUri,
    scope: settings.scope,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256'
  }

  if (!oidcConfig.serverMetadata().supportsPKCE()) {
    logger.debug("server doesn't support PKCE")
    nonce = openid.randomNonce()
    parameters.nonce = nonce
  }

  request.yar.set(settings.sessionName, {
    codeVerifier,
    nonce
  })

  const refererPath = getRefererAsRelativeURL(request?.info?.referrer, '/')
  request.yar.flash(sessionNames.referrer, refererPath)

  return openid.buildAuthorizationUrl(oidcConfig, parameters)
}

/**
 * Post-login, user has logged to AAD and has been redirected back to the auth callback.
 * If the token is validated then the credentials are returned.
 */
async function postLogin(request, oidcConfig, settings) {
  const state = request.yar.get(settings.sessionName, true)
  const codeVerifier = state?.codeVerifier
  const nonce = state?.nonce

  // These values are set in the first part, if they're missing its probably because
  // they've gone directly to the redirect link or refreshed it etc.
  Hoek.assert(
    codeVerifier || nonce,
    'No verifier set in session, try logging in again.'
  )

  // `currentUrl` must match the full external url, including hostname.
  const currentUrl = asExternalUrl(request.url, config.get('appBaseUrl'))

  logger.info('validating token')
  const token = await openid.authorizationCodeGrant(oidcConfig, currentUrl, {
    pkceCodeVerifier: codeVerifier,
    expectedNonce: nonce,
    idTokenExpected: true
  })

  Hoek.assert(token, 'Failed to validate token')

  const expiresIn = token.expiresIn()
  const claims = token.claims()
  return {
    expiresIn,
    token: token.access_token,
    accessToken: token.access_token,
    refreshToken: token.refresh_token,
    idToken: token.id_token,
    claims,
    // This bit is fairly portal specific, maybe build it in the callback handler?
    profile: {
      id: claims.oid,
      displayName: claims.name,
      email: claims.email ?? claims.preferred_username
    }
  }
}

/**
 * Refreshes the client credentials using a refresh token.
 * @param {{discoveryUri: string, clientId: string, scope: string, tokenProvider: () => Promise<string>}} settings
 * @param {string} jwtRefreshToken
 * @returns {Promise<{}>}
 */
async function refreshToken(settings, jwtRefreshToken) {
  const federatedToken = await settings.tokenProvider()

  const oidcConfig = await openid.discovery(
    new URL(settings.discoveryUri),
    settings.clientId,
    {},
    ClientFederatedCredential(federatedToken)
  )

  return openid.refreshTokenGrant(oidcConfig, jwtRefreshToken, {
    scope: settings.scope
  })
}

const optionsSchema = Joi.object({
  discoveryUri: Joi.string().uri().required(),
  redirectUri: Joi.string().uri().required(),
  clientId: Joi.string().required(),
  sessionName: Joi.string().default('oidc-auth'),
  scope: Joi.string().required(),
  tokenProvider: Joi.function().required(),
  useMocks: Joi.boolean().default(false)
})

/**
 * Implements openid-client's ClientAuth interface.
 * Takes a pre-existing JWT token and passes it in the`client_assertion` field instead of
 * the `client_secret` field.
 * @param {string} assertion
 * @returns ClientAuth
 * @class ClientFederatedCredential
 */
function ClientFederatedCredential(assertion) {
  return (_as, client, body) => {
    body.set('client_id', client.client_id)
    body.set(
      'client_assertion_type',
      'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'
    )
    body.set('client_assertion', assertion)
  }
}

function getRefererAsRelativeURL(referer, defaultPath) {
  let relative = defaultPath
  if (referer) {
    try {
      const url = new URL(referer)
      relative = url.pathname + url.search
    } catch {
      if (referer.startsWith('/')) {
        relative = referer
      }
    }
  }

  // Don't redirect back to the auth callback page as the content can only be processed once.
  if (relative.startsWith(callbackPath)) {
    relative = defaultPath
  }

  return relative
}

/**
 * @typedef {import('openid-client').ClientAuth}
 */
