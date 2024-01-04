import { provideCreate } from '~/src/server/create/helpers/pre/provide-create'
import { noSessionRedirect } from '~/src/server/create/helpers/ext/no-session-redirect'
import { summaryTestsRows } from '~/src/server/create/transformers/summary-tests-rows'

const testSummaryController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideCreate]
  },
  handler: (request, h) => {
    const create = request.pre?.create

    return h.view('create/views/summary', {
      pageTitle: 'Create test suite summary',
      heading: 'Create test suite summary',
      headingCaption:
        'Information about the new test suite you are going to create.',
      action: '/create/tests',
      summaryRows: summaryTestsRows(create),
      formButtonText: 'Create',
      create
    })
  }
}

export { testSummaryController }
