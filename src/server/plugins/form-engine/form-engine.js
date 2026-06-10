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
          actions: resolvedActions,
          resolveComponent
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

        const validationResult = formSchema.validate(formValues, {
          abortEarly: false,
          stripUnknown: true
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

function defaultComponent(def) {
  const type =
    def.type === 'array' && def.items.length === 1
      ? def.items[0].type
      : def.type

  return typeToField[type] ?? 'inputField'
}

function resolveComponent(def) {
  const component =
    def.metas?.find((meta) => meta.component)?.component ??
    defaultComponent(def)

  return this.ctx[component] ?? this.ctx.string
}

function getDefaults(formDefinition) {
  return Object.fromEntries(
    Object.entries(formDefinition.keys).map(([name, def]) => [
      name,
      def.flags?.default
    ])
  )
}
