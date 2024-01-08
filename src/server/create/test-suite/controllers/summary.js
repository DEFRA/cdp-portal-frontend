import { provideCreate } from '~/src/server/create/helpers/pre/provide-create'
import { noSessionRedirect } from '~/src/server/create/helpers/ext/no-session-redirect'
import { summaryTestSuiteRows } from '~/src/server/create/test-suite/transformers/summary-test-suite-rows'

const testSuiteSummaryController = {
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
      summaryRows: summaryTestSuiteRows(create),
      formButtonText: 'Create',
      create
    })
  }
}

export { testSuiteSummaryController }
