import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockCsrfToken
} from '#test-helpers/common-page-rendering.js'
import hapi from '@hapi/hapi'
import formEngine from './form-engine.js'
import Joi from 'joi'
import { statusCodes } from '@defra/cdp-validation-kit'
import { sessionManager } from '../session-manager.js'
import { addFlashMessagesToContext } from '#server/common/helpers/add-flash-messages-to-context.js'
import { nunjucksConfig } from '#config/nunjucks/index.js'
import { sessionCookie } from '#server/common/helpers/auth/session-cookie.js'
import qs from 'qs'
import { getCacheEngine } from '#server/common/helpers/session/cache-engine.js'
import { csrf } from '../csrf.js'
import { createServer } from '#server/index.js'
import { config } from '#config/config.js'

describe('formEngine', () => {
  let server

  beforeAll(async () => {
    config.set('session.cache.engine', 'memory')

    server = await createServer()

    await mockCsrfToken(server)

    await server.initialize()

    await server.register({
      plugin: formEngine,
      options: {
        route: {
          path: '/form'
        },

        layout: 'plugins/form-engine/form-engine.test.njk',

        async schema() {
          return Joi.object({
            textInput: Joi.string()
              .label('Text input')
              .description('without default')
              .required(),

            textInputDefault: Joi.string()
              .label('Text input')
              .description('with default')
              .required()
              .default('default value')
          })
        },

        actions() {
          return {
            submit: {
              text: 'Submit',
              method() {}
            },
            cancel: {
              text: 'Cancel',
              url: '/'
            }
          }
        }
      }
    })

    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('Renders the form', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: `/form`
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })
})
