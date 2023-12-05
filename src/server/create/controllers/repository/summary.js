import { provideCreate } from '~/src/server/create/helpers/pre/provide-create'
import { noSessionRedirect } from '~/src/server/create/helpers/ext/no-session-redirect'
import { summaryRepositoryRows } from '~/src/server/create/transformers/summary-repository-rows'

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
      heading: 'Create repository summary',
      headingCaption:
        'Information about the new repository you are going to create.',
      action: '/create/repository',
      summaryRows: summaryRepositoryRows(create),
      formButtonText: 'Create',
      create
    })
  }
}

export { repositorySummaryController }
