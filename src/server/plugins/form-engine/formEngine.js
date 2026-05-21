const typeComponents = {
  string: 'govukInput',
  number: 'govukInput'
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
          resolveComponent
        })
      }
    })
  }
}

function resolveComponent(def) {
  let component = 'govukInput'

  const type = def.type === 'array' ? def.items[0].type : def.type

  console.dir(def, { depth: 10 })
  component = typeComponents[type] ?? component

  // schema override
  component = def.metas?.find((meta) => meta.component).component ?? component

  return this.ctx[component]
}
