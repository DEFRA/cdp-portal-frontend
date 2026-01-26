import * as openid from 'openid-client'
import assert from 'assert'

/**
 * Initiates the OIDC login flow.
 * Generates PKCE code verifier/challenge and builds the authorization URL.
 * Stores PKCE verifier (and nonce if PKCE is unsupported) in a cookie.
 * @param {Object} params
 * @param {import('openid-client').Client} params.oidcConfig - The OIDC client configuration.
 * @param {Object} params.opts - Options including OIDC settings and cookie name.
 * @param {import('@hapi/hapi').ResponseToolkit} params.h - Hapi response toolkit.
 * @param {Object} [params.logger] - Optional logger.
 * @returns {import('@hapi/hapi').ResponseObject} A redirect response to the OIDC provider with state cookie.
 */
export async function preLogin({ oidcConfig, opts, h, logger }) {
  const codeVerifier = openid.randomPKCECodeVerifier()
  const codeChallenge = await openid.calculatePKCECodeChallenge(codeVerifier)

  const params = {
    redirect_uri: opts.oidc.loginCallbackUri,
    scope: opts.oidc.scope,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256'
  }

  const cookieValue = { codeVerifier }

  if (!oidcConfig.serverMetadata().supportsPKCE()) {
    logger?.debug?.("Server doesn't support PKCE; using nonce")
    const nonce = openid.randomNonce()
    params.nonce = nonce
    cookieValue.nonce = nonce
  }

  const redirectUrl = openid.buildAuthorizationUrl(oidcConfig, params)
  logger?.info(
    `PreLogin - code verifier: ${cookieValue.codeVerifier} nonce: ${cookieValue.nonce} redirectUrl ${redirectUrl}`
  )
  return h.redirect(redirectUrl).state(opts.cookie, cookieValue).takeover()
}

// /**
//  * Returns a relative path from a referer URL.
//  * Will replace it with defaultPath if it matches the callback path.
//  *
//  * @param {string | undefined} referer - Full referer URL from request
//  * @param {string} defaultUri - Default path if parsing fails or matches callback
//  * @param {string} callbackUri - The path to exclude (e.g., '/auth/callback')
//  * @returns {string} - Safe relative path
//  */
// function getRefererAsRelativeURL(referer, defaultUri, callbackUri) {
//   if (!referer) return defaultUri
//
//   let relative = defaultUri
//
//   try {
//     const url = new URL(referer)
//     relative = url.pathname + url.search
//   } catch {
//     if (referer.startsWith('/')) {
//       relative = referer
//     }
//   }
//
//   if (callbackUri && relative.startsWith(callbackUri)) {
//     return defaultUri
//   }
//
//   return relative
// }

/**
 * Handles the OIDC callback after login.
 * Validates PKCE code verifier / nonce and exchanges the authorization code for tokens.
 * @param {Object} params
 * @param {string} params.codeVerifier - The PKCE code verifier from preLogin cookie.
 * @param {string} params.nonce - The nonce from preLogin cookie (if PKCE unsupported).
 * @param {import('openid-client').Client} params.oidcConfig - The OIDC client configuration.
 * @param {string} params.currentUrl - The full callback URL received from OIDC provider.
 * @param {Object} [params.logger] - Optional logger.
 * @returns {Promise<{expiresIn: number, accessToken: string, refreshToken: string, idToken: string, claims: Object}>} Tokens and claims from OIDC.
 * @throws {Error} If PKCE verifier/nonce are missing or token validation fails.
 */
export async function postLogin({
  codeVerifier,
  nonce,
  oidcConfig,
  currentUrl,
  logger
}) {
  // These values are set in the preLogin, if they are missing its probably because
  // user has gone directly to the redirect link or refreshed etc.
  assert(
    codeVerifier || nonce,
    'Missing PKCE verifier/nonce in session; try logging in again'
  )

  logger?.info(
    `PostLogin - code verifier: ${codeVerifier} nonce: ${nonce} currentUrl ${currentUrl}`
  )

  logger?.info?.('validating token')
  const token = await openid.authorizationCodeGrant(oidcConfig, currentUrl, {
    pkceCodeVerifier: codeVerifier,
    expectedNonce: nonce,
    idTokenExpected: true
  })

  assert(token, 'Failed to validate token')

  const {
    access_token: accessToken,
    refresh_token: refreshToken,
    id_token: idToken
  } = token
  const claims = token.claims()
  const expiresIn = token.expiresIn()
  return { accessToken, refreshToken, idToken, claims, expiresIn }
}
