import { provideCreate } from '~/src/server/create/helpers/pre/provide-create.js'
import { noSessionRedirect } from '~/src/server/create/helpers/ext/no-session-redirect.js'
import { summaryTestSuiteRows } from '~/src/server/create/journey-test-suite/transformers/summary-test-suite-rows.js'

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
      pageTitle: 'Summary journey test suite',
      heading: 'Summary journey test suite',
      headingCaption:
        'Information about the new journey test suite you are going to create.',
      action: '/create/journey-test-suite',
      summaryRows: summaryTestSuiteRows(create),
      formButtonText: 'Create',
      create
    })
  }
}

export { testSuiteSummaryController }
