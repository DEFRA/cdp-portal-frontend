import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockCsrfToken
} from '#test-helpers/common-page-rendering.js'
import formEngine from './form-engine.js'
import Joi from 'joi'
import { statusCodes } from '@defra/cdp-validation-kit'
import { createServer } from '#server/index.js'
import { config } from '#config/config.js'
import { buildOptions } from '#server/common/helpers/options/build-options.js'

const suggestions = buildOptions(['default value', 'another value'])

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
              .default('default value'),

            selectInput: Joi.string()
              .label('Select input')
              .description('without default')
              .valid('default value', 'another value')
              .required()
              .meta({ suggestions }),

            selectDefault: Joi.string()
              .label('Select input')
              .description('with default')
              .valid('default value', 'another value')
              .required()
              .default('default value')
              .meta({ suggestions })
          })
        },

        async load(request) {
          const isEdit = request.query.edit !== undefined

          if (isEdit) {
            return {
              textInput: 'test',
              textInputDefault: 'test',
              selectInput: 'another value',
              selectInputDefault: 'another value'
            }
          }

          return undefined
        },

        async actions() {
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

  test('Renders the form with defaults', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: `/form`
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })

  test('Renders the form with init values', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: `/form?edit`
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })
})
