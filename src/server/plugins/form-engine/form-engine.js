import { sessionNames } from '#server/common/constants/session-names.js'
import { buildErrorDetails } from '#server/common/helpers/build-error-details.js'
import { provideFormContextValues } from '#server/common/helpers/form/provide-form-context-values.js'
import provideHelpers from './ext/provideHelpers.js'

const typeToField = {
  string: 'inputField',
  array: 'arrayField',
  boolean: 'booleanField',
  object: 'detailsField'
}

export default {
  name: 'formEngine',
  multiple: true,
  version: '0.0.1',
  description: 'Joi schema based forms',
  register: async function (server, options) {
    const {
      sessionKey,
      route,
      layout,
      schema,
      load = () => undefined,
      ext = [],
      actions
    } = options

    await server.ext([
      ...ext,
      {
        type: 'onPostHandler',
        method: provideFormContextValues(sessionKey),
        options: { before: ['yar'], sandbox: 'plugin' }
      },
      provideHelpers
    ])

    await server.route({
      ...route,
      method: 'GET',
      async handler(request, h) {
        const formSchema = await schema(request, h)
        const formDefinition = formSchema.describe()

        const formValues =
          (await load(request, h)) ?? getDefaults(formDefinition)
        const resolvedActions = await actions(request, h)

        return h.view('plugins/form-engine/form', {
          fields: formDefinition.keys,
          layout,
          formValues,
          actions: resolvedActions
        })
      }
    })

    await server.route({
      ...route,
      method: 'POST',
      async handler(request, h) {
        const formSchema = await schema(request, h)
        const { csrfToken, actionButton, ...formValues } = request.payload

        const resolvedActions = await actions(request, h)
        const action = resolvedActions[actionButton]

        const validationResult = formSchema.validate(expandNested(formValues), {
          abortEarly: false,
          stripUnknown: true,
          convert: true
        })

        if (validationResult.error) {
          request.logger.debug(
            validationResult,
            'formEngine - failed validation result'
          )

          const errorDetails = buildErrorDetails(validationResult.error.details)

          request.yar.flash(sessionNames.validationFailure, {
            formValues,
            formErrors: errorDetails
          })

          return h.redirect(request.url)
        }

        request.yar.clear(sessionNames.validationFailure)

        return await action.method(request, h, validationResult.value)
      }
    })
  }
}

export function resolveFormComponent(def) {
  const component =
    def.metas?.find((meta) => meta.component)?.component ??
    defaultComponent(def)

  return this.ctx[component] ?? this.ctx.string
}

function defaultComponent(def) {
  const type =
    def.type === 'array' && def.items.length === 1
      ? def.items[0].type
      : def.type

  return typeToField[type] ?? 'inputField'
}

function getDefaults(formDefinition) {
  return Object.fromEntries(
    Object.entries(formDefinition.keys)
      .map(([name, def]) => {
        if (def.keys) {
          return Object.entries(def.keys).map(([n, d]) => [
            `${name}.${n}`,
            d.flags?.default
          ]) // TODO: handle any depth
        }
        return [[name, def.flags?.default]]
      })
      .flat()
  )
}

function expandNested(formValues = {}) {
  return Object.fromEntries(
    Object.entries(formValues).map(([key, value]) => {
      if (key.includes('.')) {
        const parts = key.split('.')
        return [parts[0], { [parts[1]]: value }] // TODO: handle any depth
      }

      return [key, value]
    })
  )
}
