export default {
  name: 'formEngine',
  version: '0.0.1',
  description: 'Joi schema based forms',
  register: async function (server, options) {
    const { path, layout, layoutHandler = () => {}, schema, pre } = options

    const definition = schema.describe()

    server.route({
      method: 'GET',
      path,
      options: {
        pre
      },
      async handler(request, h) {
        const layoutContext = await layoutHandler(request, h)

        return h.view('plugins/form-engine/form', {
          ...layoutContext,
          fields: definition.keys,
          layout
        })
      }
    })
  }
}
