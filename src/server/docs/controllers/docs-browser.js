import Joi from 'joi'
import Boom from '@hapi/boom'

const docsBrowserController = {
  options: {
    validate: {
      params: Joi.object({
        docsPath: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: (request, h) => {
    const docsPath = request.params.docsPath

    return h.view('docs/views/docs-browser', {
      pageTitle: 'Docs',
      heading: 'Docs',
      docsPath,
      breadcrumbs: [
        {
          text: 'Docs',
          href: '/docs-browser'
        },
        {
          text: docsPath
        }
      ]
    })
  }
}

export { docsBrowserController }
