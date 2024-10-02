import Joi from 'joi'
import Boom from '@hapi/boom'

const docsBrowserController = {
  options: {
    validate: {
      params: Joi.object({
        docsPath: Joi.string().default('README.md')
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: (request, h) => {
    const docsPath = request.params.docsPath

    return h.view('docs/views/docs-browser', {
      pageTitle: 'Docs',
      heading: 'Docs',
      docsPath
    })
  }
}

export { docsBrowserController }
