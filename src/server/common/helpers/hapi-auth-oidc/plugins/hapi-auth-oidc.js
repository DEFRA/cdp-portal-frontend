import Joi from 'joi'
import Boom from '@hapi/boom'
import { postLogin, preLogin } from '../oidc/flow.js'
import { validateAndRefreshToken } from '../oidc/refresh.js'
import * as Hoek from '@hapi/hoek'

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
    server.state(opts.cookie, opts.cookieOptions)
    server.auth.scheme('hapi-auth-oidc', () => {
      return {
        authenticate: async (request, h) => {
          const { logger } = request
          const { oidc, cookie } = opts
          const { getOidcConfig } = oidc
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

            const currentUrl = new URL(
              request.url.pathname + request.url.search,
              opts.externalBaseUrl
            )
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

    server.auth.strategy(opts.strategyName, 'hapi-auth-oidc')
    server.expose(
      'validateAndRefreshToken',
      async function ({ refreshToken, accessToken }) {
        return validateAndRefreshToken(
          { refreshToken, accessToken },
          opts.oidc.getOidcConfig,
          opts.oidc.earlyRefreshMs,
          opts.scope,
          server.logger
        )
      }
    )

    if (opts.oidc.enableRefreshDecoration) {
      server.decorate(
        'request',
        'validateAndRefreshToken',
        async function ({ refreshToken, accessToken }) {
          return validateAndRefreshToken(
            { refreshToken, accessToken },
            opts.oidc.getOidcConfig,
            opts.oidc.earlyRefreshMs,
            opts.scope,
            this.logger
          )
        }
      )
    }
  }
}

const schema = Joi.object({
  strategyName: Joi.string().default('hapi-auth-oidc'),
  oidc: Joi.object({
    getOidcConfig: Joi.function().arity(1).required(),
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
