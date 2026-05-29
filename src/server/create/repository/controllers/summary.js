import { summaryRepositoryRows } from '../transformers/summary-repository-rows.js'

const repositorySummaryController = {
  handler: (request, h) => {
    const create = request.app.getStepData()

    return h.view('create/views/summary', {
      pageTitle: 'Create repository summary',
      heading: 'Create repository',
      headingCaption:
        'Information about the new repository you are going to create',
      action: '/create/repository',
      summaryRows: summaryRepositoryRows(create),
      formButtonText: 'Create',
      create
    })
  }
}

export { repositorySummaryController }
