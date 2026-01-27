import Joi from 'joi'
import Boom from '@hapi/boom'
import { postLogin, preLogin } from '../oidc/flow.js'
import { validateAndRefreshToken } from '../oidc/refresh.js'
import * as Hoek from '@hapi/hoek'
import { createOidcConfig } from '../oidc/client-config.js'

/**
 * Hapi plugin providing OIDC authentication with PKCE support.
 * Handles pre-login (redirect to OIDC provider) and post-login (callback) flows.
 * Optionally decorates requests with a token validation and refresh method.
 */
export const HapiAuthOidcPlugin = {
  name: 'hapi-auth-oidc',
  /**
   * Registers the plugin with a Hapi server.
   *
   * @param {import('@hapi/hapi').Server} server - Hapi server instance
   * @param {Object} options - Plugin configuration options
   * @param {string} [options.strategyName='hapi-auth-oidc'] - Name of the auth strategy
   * @param {Object} options.oidc - OIDC configuration object
   * @param {Function} options.oidc.getOidcConfig - Async function returning OIDC client config
   * @param {string} options.oidc.scope - Default scope for token requests
   * @param {string} options.oidc.loginCallbackUri - Redirect URI for post-login
   * @param {string} options.oidc.externalBaseUrl - Base URL for server to build absolute URLs
   * @param {string} [options.oidc.defaultPostLoginUri='/'] - Default URI to redirect after login
   * @param {boolean} [options.oidc.enableRefreshDecoration=true] - Whether to decorate request with token refresh method
   * @param {number} [options.oidc.earlyRefreshMs=60000] - Time in ms to refresh token early
   * @param {string} [options.cookie='hapi-auth-oidc'] - Cookie name for storing OIDC state
   * @param {Object} options.cookieOptions - Cookie options for Iron encryption and security
   */
  register: async function (server, options) {
    const opts = Joi.attempt(Hoek.clone(options), schema)
    const { oidc, cookie, cookieOptions, strategyName } = opts
    const {
      discoveryUri,
      clientId,
      discoveryRequestOptions,
      externalBaseUrl,
      enableRefreshDecoration,
      earlyRefreshMs,
      scope
    } = oidc

    const getOidcConfig = async (logger) =>
      await createOidcConfig({
        discoveryUri,
        clientId,
        authProvider: options.oidc.authProvider, // Hoek clone drops the private fields
        discoveryRequestOptions,
        logger
      })

    server.state(cookie, cookieOptions)
    server.auth.scheme('hapi-auth-oidc', () => {
      return {
        authenticate: async (request, h) => {
          const { logger } = request

          const oidcConfig = await getOidcConfig(logger)

          const isPreLogin = !request.query.code
          if (isPreLogin) {
            try {
              return await preLogin({
                oidcConfig,
                opts,
                h,
                logger
              })
            } catch (e) {
              logger?.error?.(e, 'PreLogin Federated login failed')
              return Boom.unauthorized(e)
            }
          }
          try {
            const state = request.state[cookie]

            const codeVerifier = state?.codeVerifier
            const nonce = state?.nonce

            // `currentUrl` must match the full external url, including hostname.
            const currentUrl = asExternalUrl(request.url, externalBaseUrl)

            const credentials = await postLogin({
              codeVerifier,
              nonce,
              oidcConfig,
              currentUrl,
              logger
            })
            h.unstate(cookie)

            return h.authenticated({ credentials })
          } catch (e) {
            logger?.error?.(e, `Post login failed:\n${JSON.stringify(e)}`)
            return Boom.unauthorized(e)
          }
        }
      }
    })

    server.auth.strategy(strategyName, 'hapi-auth-oidc')
    server.expose(
      'validateAndRefreshToken',
      async function ({ refreshToken, accessToken }) {
        return validateAndRefreshToken(
          { refreshToken, accessToken },
          getOidcConfig,
          earlyRefreshMs,
          scope,
          server.logger
        )
      }
    )

    if (enableRefreshDecoration) {
      server.decorate(
        'request',
        'validateAndRefreshToken',
        async function ({ refreshToken, accessToken }) {
          return validateAndRefreshToken(
            { refreshToken, accessToken },
            getOidcConfig,
            earlyRefreshMs,
            scope,
            this.logger
          )
        }
      )
    }
  }
}

export function asExternalUrl(url, external) {
  const currentUrl = new URL(url)
  const externalUrl = new URL(external)
  currentUrl.protocol = externalUrl.protocol
  currentUrl.hostname = externalUrl.hostname
  currentUrl.port = externalUrl.port

  return currentUrl
}

const schema = Joi.object({
  strategyName: Joi.string().default('hapi-auth-oidc'),
  oidc: Joi.object({
    discoveryUri: Joi.string().uri().required(),
    clientId: Joi.string().required(),
    authProvider: Joi.object({
      getCredentials: Joi.function().arity(1).required(),
      type: Joi.string().required()
    })
      .unknown(true)
      .required(),
    discoveryRequestOptions: Joi.object().default({}),
    // getOidcConfig: Joi.function().arity(1).required(),
    // getOidcConfig: Joi.function().arity(1).required(),
    scope: Joi.string().required(),
    loginCallbackUri: Joi.string().uri().required(),
    externalBaseUrl: Joi.string().uri().required(),
    defaultPostLoginUri: Joi.string().uri().optional().default('/'),
    enableRefreshDecoration: Joi.boolean().default(true),
    earlyRefreshMs: Joi.number().integer().min(0).default(60_000)
  }).required(),
  cookie: Joi.string()
    .min(32)
    .default('hapi-auth-oidc')
    .description('Name of the cookie'),
  cookieOptions: Joi.object({
    password: Joi.string()
      .min(32)
      .required()
      .description('Secret used for Iron encryption'),
    encoding: Joi.string()
      .valid('none', 'base64', 'base64json', 'iron')
      .default('iron')
      .description('Cookie encoding type'),
    path: Joi.string().default('/').description('Cookie path'),
    isSecure: Joi.boolean()
      .default(true)
      .description('Send cookie over HTTPS only'),
    isHttpOnly: Joi.boolean()
      .default(true)
      .description('Cookie not accessible via client-side JS'),
    isSameSite: Joi.string()
      .valid('Strict', 'Lax', 'None')
      .default('Lax')
      .description('SameSite cookie policy'),
    ttl: Joi.number()
      .integer()
      .min(0)
      .optional()
      .description('Time-to-live in milliseconds'),
    domain: Joi.string().optional().description('Cookie domain'),
    ignoreErrors: Joi.boolean()
      .default(true)
      .description('Ignore encoding errors'),
    clearInvalid: Joi.boolean()
      .default(true)
      .description('Automatically clear invalid cookies')
  }).required()
})
