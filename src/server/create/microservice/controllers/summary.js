import { provideCreate } from '~/src/server/create/helpers/pre/provide-create.js'
import { noSessionRedirect } from '~/src/server/create/helpers/ext/no-session-redirect.js'
import { summaryMicroserviceRows } from '~/src/server/create/microservice/transformers/summary-microservice-rows.js'

const microserviceSummaryController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideCreate]
  },
  handler: async (request, h) => {
    const create = request.pre?.create
    const authedUser = await request.getUserSession()

    return h.view('create/views/summary', {
      pageTitle: 'Create microservice summary',
      heading: 'Create microservice summary',
      headingCaption:
        'Information about the new microservice you are going to create.',
      action: '/create/microservice',
      summaryRows: summaryMicroserviceRows(create, authedUser.isAdmin),
      formButtonText: 'Create',
      create
    })
  }
}

export { microserviceSummaryController }
