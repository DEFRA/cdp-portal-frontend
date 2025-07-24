import { provideCreate } from '../../helpers/pre/provide-create.js'
import { noSessionRedirect } from '../../helpers/ext/no-session-redirect.js'
import { summaryRepositoryRows } from '../transformers/summary-repository-rows.js'

const repositorySummaryController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideCreate]
  },
  handler: (request, h) => {
    const create = request.pre?.create

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
