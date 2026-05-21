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
      ext
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

        return h.view('plugins/form-engine/form', {
          ...layoutContext,
          fields: formDefinition.keys,
          layout,
          resolveComponent,
          resolveLabel,
          resolveItems
        })
      }
    })

    await server.route({
      ...route,
      method: 'POST',
      async handler(request, h) {
        const formSchema = await schema(request, h)
        const { csrfToken, actionButton, ...formValues } = request.payload

        const validationResult = formSchema.validate(formValues, {
          abortEarly: false
        })

        if (validationResult?.error) {
          const errorDetails = buildErrorDetails(validationResult.error.details)

          request.yar.flash(sessionNames.validationFailure, {
            formValues,
            formErrors: errorDetails
          })

          return h.redirect(request.url)
        }

        return h.redirect(request.url)
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
  // props = {
  //   ...props,
  //   ...(def.metas?.find((meta) => meta.props)?.props ?? {})
  // }

  return this.ctx[component] ?? this.ctx.string
}

function resolveItems(def) {
  return def.items?.map((item) => ({ value: '', text: item.flags?.label }))
}
