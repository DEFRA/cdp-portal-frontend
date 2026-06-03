import { sessionNames } from '#server/common/constants/session-names.js'
import { buildErrorDetails } from '#server/common/helpers/build-error-details.js'
import { provideFormContextValues } from '#server/common/helpers/form/provide-form-context-values.js'

const typeToField = {
  string: 'inputField',
  array: 'arrayField'
}

export default {
  name: 'formEngine',
  version: '0.0.1',
  description: 'Joi schema based forms',
  register: async function (server, options) {
    const {
      sessionKey,
      route,
      layout,
      layoutHandler = () => {},
      schema,
      init = () => undefined,
      ext = [],
      actions
    } = options

    await server.ext([
      ...ext,
      {
        type: 'onPostHandler',
        method: provideFormContextValues(sessionKey),
        options: { before: ['yar'], sandbox: 'plugin' }
      }
    ])

    await server.route({
      ...route,
      method: 'GET',
      async handler(request, h) {
        const formSchema = await schema(request, h)
        const formDefinition = formSchema.describe()

        const layoutContext = await layoutHandler(request, h) // TODO: Replace with ext ?

        const formValues = await init(request, h)
        const resolvedActions = await actions(request, h)

        return h.view('plugins/form-engine/form', {
          ...layoutContext,
          fields: formDefinition.keys,
          layout,
          formValues,
          actions: resolvedActions,
          resolveComponent,
          resolveLabel,
          resolveItems,
          resolveMeta
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

function resolveLabel(def, name) {
  return `${def.flags.label ?? name}${def.flags.presence === 'optional' ? ' (optional)' : ''}`
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

function resolveItems(def, values) {
  return def.items?.map((item) => ({
    value: item.allow.at(0),
    text: item.flags?.label,
    checked: values?.includes(item.allow.at(0))
  }))
}

function resolveMeta(def, name) {
  return def.metas?.find((meta) => meta[name])?.[name]
}
