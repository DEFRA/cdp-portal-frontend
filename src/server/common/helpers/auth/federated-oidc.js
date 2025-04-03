import * as Hoek from '@hapi/hoek'
import * as openid from 'openid-client'
import Joi from 'joi'
import Boom from '@hapi/boom'

import { getAADCredentials } from '~/src/server/common/helpers/auth/cognito.js'
import { config } from '~/src/config/config.js'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import * as undici from 'undici'
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

  return {
    authenticate: async function (request, h) {
      const federatedToken = await options.tokenProvider()

      const oidcConfig = await openid.discovery(
        new URL(settings.discoveryUri),
        settings.clientId,
        {},
        ClientFederatedCredential(federatedToken)
      )

      oidcConfig[openid.customFetch] = async (...args) => {
        logger.info(`[OIDC Fetch Request] ${args[0]}`)

        const response = await undici.fetch(args[0], { ...args[1] })
        const bodyText = await response.text()

        logger.info(`[OIDC Fetch Response] ${args[0]}`)
        logger.info(`[OIDC Fetch Response] Status: ${response.status}`)
        logger.info(`[OIDC Fetch Response] Body: ${bodyText}`)

        // Recreate the response so it's usable downstream
        return new Response(bodyText, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        })
      }

      const isPreLogin = !request.query.code

      if (isPreLogin) {
        try {
          // User has just started the login flow.
          const redirectTo = await preLogin(request, oidcConfig, settings)
          return h.redirect(redirectTo).takeover()
        } catch (err) {
          logger.error('PreLogin Federated login failed')
          logger.error(err)
          return Boom.unauthorized(err)
        }
      } else {
        // User has logged in and been redirected back to the auth callback
        try {
          const credentials = await postLogin(request, oidcConfig, settings)
          return h.authenticated({ credentials })
        } catch (err) {
          logger.error('Post Federated login failed')
          logger.error(err)
          return Boom.unauthorized(err)
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
    logger.info("server doesn't support PKCE, generating nonce")
    nonce = openid.randomNonce()
    parameters.nonce = nonce
  }

  request.yar.set(settings.sessionName, {
    codeVerifier,
    nonce
  })

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
  const currentUrl = new URL(config.get('appBaseUrl') + request.url.pathname)

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
    token: token.id_token,
    accessToken: token.access_token,
    refreshToken: token.refresh_token,
    claims,
    // The profile section is portal/AAD specific, to make this more generic we can build it later on.
    profile: {
      id: claims.oid,
      displayName: claims.name,
      email: claims.email ?? claims.preferred_username
    }
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
  return (as, client, body) => {
    body.set('client_id', client.client_id)
    body.set(
      'client_assertion_type',
      'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'
    )
    body.set('client_assertion', assertion)
  }
}

/**
 * @typedef {import('openid-client').ClientAuth}
 */
