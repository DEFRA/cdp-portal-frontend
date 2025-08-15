import { provideCreate } from '../../helpers/pre/provide-create.js'
import { noSessionRedirect } from '../../helpers/ext/no-session-redirect.js'
import { summaryTestSuiteRows } from '../../helpers/transformers/summary-test-suite-rows.js'

const testSuiteSummaryController = {
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
      pageTitle: 'Create journey test suite summary',
      heading: 'Create journey test suite',
      headingCaption:
        'Information about the new journey test suite you are going to create',
      action: '/create/journey-test-suite',
      summaryRows: summaryTestSuiteRows(
        create,
        'journey-test-suite',
        userSession?.isAdmin
      ),
      formButtonText: 'Create',
      create
    })
  }
}

export { testSuiteSummaryController }
