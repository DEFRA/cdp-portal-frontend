import { provideCreate } from '../../helpers/pre/provide-create.js'
import { noSessionRedirect } from '../../helpers/ext/no-session-redirect.js'
import { summaryTestSuiteRows } from '../../helpers/transformers/summary-test-suite-rows.js'

const perfTestSuiteSummaryController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideCreate]
  },
  handler: async (request, h) => {
    const create = request.pre?.create
    const userSession = request.auth.credentials

    return h.view('create/views/summary', {
      pageTitle: 'Create performance test suite summary',
      heading: 'Create performance test suite',
      headingCaption:
        'Information about the new performance test suite you are going to create',
      action: '/create/perf-test-suite',
      summaryRows: summaryTestSuiteRows(
        create,
        'perf-test-suite',
        userSession?.isAdmin
      ),
      formButtonText: 'Create',
      create
    })
  }
}

export { perfTestSuiteSummaryController }
