const typeToField = {
  string: 'inputField'
}

export default {
  name: 'formEngine',
  version: '0.0.1',
  description: 'Joi schema based forms',
  register: async function (server, options) {
    const { route, layout, layoutHandler = () => {}, schema, ext } = options

    await server.ext(ext)

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
          resolveLabel
        })
      }
    })
  }
}

function resolveLabel(def, name) {
  return `${def.flags.label ?? name}${def.flags.presence === 'optional' ? ' (optional)' : ''}`
}

function defaultComponent(def) {
  const type =
    def.type === 'array' && def.items.length > 1 ? def.items[0].type : def.type

  return typeToField[type] ?? 'inputField'
}

function resolveComponent(def) {
  console.dir(def, { depth: 10 })

  const component =
    def.metas?.find((meta) => meta.component)?.component ??
    defaultComponent(def)
  // props = {
  //   ...props,
  //   ...(def.metas?.find((meta) => meta.props)?.props ?? {})
  // }

  return this.ctx[component] ?? this.ctx.string
}
