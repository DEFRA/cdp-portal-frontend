import { provideCreate } from '../../helpers/pre/provide-create.js'
import { noSessionRedirect } from '../../helpers/ext/no-session-redirect.js'
import { summaryMicroserviceRows } from '../transformers/summary-microservice-rows.js'

const microserviceSummaryController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideCreate]
  },
  handler: async (request, h) => {
    const create = request.pre?.create
    const userSession = await request.getUserSession()

    return h.view('create/views/summary', {
      pageTitle: 'Create microservice summary',
      heading: 'Create microservice',
      headingCaption:
        'Information about the new microservice you are going to create',
      action: '/create/microservice',
      summaryRows: summaryMicroserviceRows(create, userSession?.isAdmin),
      formButtonText: 'Create',
      create
    })
  }
}

export { microserviceSummaryController }
