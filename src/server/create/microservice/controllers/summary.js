import { summaryMicroserviceRows } from '../transformers/summary-microservice-rows.js'

const microserviceSummaryController = {
  handler: async (request, h) => {
    const create = request.app.getStepData()
    const userSession = request.auth.credentials

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
