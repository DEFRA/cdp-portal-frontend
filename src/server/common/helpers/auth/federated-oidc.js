import * as Hoek from '@hapi/hoek'
import * as openid from 'openid-client'
import Joi from 'joi'
import Boom from '@hapi/boom'

import { getAADCredentials } from '~/src/server/common/helpers/auth/cognito.js'
import { config } from '~/src/config/config.js'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'

const logger = createLogger()

export const federatedOidc = {
  name: 'federatedOidc',
  register: function (server) {
    server.auth.scheme('federated-oidc', scheme)
    server.auth.strategy('azure-oidc', 'federated-oidc', {
      discoveryUri: config.get('oidcWellKnownConfigurationUrl'),
      redirectUri: config.get('appBaseUrl') + '/auth/callback',
      clientId: config.get('azureClientId'),
      scope: `api://${config.get('azureClientId')}/cdp.user openid profile email offline_access user.read`,
      tokenProvider: getAADCredentials
    })
  }
}

const scheme = function (server, options) {
  Hoek.assert(options, 'Federated ODIC authentication options missing')
  const settings = Joi.attempt(Hoek.clone(options), optionsSchema)

  server.decorate(
    'request',
    'refreshToken',
    async (jwtRefreshToken) => await refreshToken(settings, jwtRefreshToken)
  )
  return {
    authenticate: async function (request, h) {
      const federatedToken = await settings.tokenProvider()

      const oidcConfig = await openid.discovery(
        new URL(settings.discoveryUri),
        settings.clientId,
        {},
        ClientFederatedCredential(federatedToken)
      )

      const isPreLogin = !request.query.code

      if (isPreLogin) {
        try {
          // User has just started the login flow.
          const redirectTo = await preLogin(request, oidcConfig, settings)
          return h.redirect(redirectTo).takeover()
        } catch (e) {
          logClientError('PreLogin Federated login failed', e)
          return Boom.unauthorized(e)
        }
      } else {
        // User has logged in and been redirected back to the auth callback
        try {
          const credentials = await postLogin(request, oidcConfig, settings)
          return h.authenticated({ credentials })
        } catch (e) {
          logClientError('Post Federated login failed', e)
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

  // CurrentUrl must match the full external url, including hostname.
  const currentUrl = asExternalUrl(request.url)

  logger.info(`validating token from ${currentUrl.toString()}`)
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
 * Decorates the request object as `request.refreshToken(token)`
 * @param {{}} settings
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

  try {
    return await openid.refreshTokenGrant(oidcConfig, jwtRefreshToken, {
      scope: settings.scope
    })
  } catch (e) {
    logClientError('refreshToken failed', e)
    throw e
  }
}

function logClientError(msg, err) {
  if (err instanceof openid.ClientError) {
    logger.error(
      `${msg}: ${err.name} ${err.code} ${err.message}\n${err.cause.stack}`
    )
  } else {
    logger.error(msg, err)
  }
}

const optionsSchema = Joi.object({
  discoveryUri: Joi.string().uri().required(),
  redirectUri: Joi.string().uri().required(),
  clientId: Joi.string().required(),
  sessionName: Joi.string().default('oidc-auth'),
  scope: Joi.string().required(),
  tokenProvider: Joi.function().required()
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

function asExternalUrl(url) {
  const currentUrl = new URL(url)
  const externalBaseUrl = new URL(config.get('appBaseUrl'))

  currentUrl.protocol = externalBaseUrl.protocol
  currentUrl.hostname = externalBaseUrl.hostname
  currentUrl.port = externalBaseUrl.port
  return currentUrl
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
  if (relative.startsWith('/auth/callback')) {
    relative = defaultPath
  }

  return relative
}

/**
 * @typedef {import('openid-client').ClientAuth}
 */
