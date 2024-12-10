import { provideCreate } from '~/src/server/create/helpers/pre/provide-create.js'
import { noSessionRedirect } from '~/src/server/create/helpers/ext/no-session-redirect.js'
import { summaryTestSuiteRows } from '~/src/server/create/helpers/transformers/summary-test-suite-rows.js'

const perfTestSuiteSummaryController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideCreate]
  },
  handler: async (request, h) => {
    const create = request.pre?.create
    const authedUser = await request.getUserSession()

    return h.view('create/views/summary', {
      pageTitle: 'Summary performance test suite',
      heading: 'Summary performance test suite',
      headingCaption:
        'Information about the new performance test suite you are going to create.',
      action: '/create/perf-test-suite',
      summaryRows: summaryTestSuiteRows(
        create,
        'perf-test-suite',
        authedUser.isAdmin
      ),
      formButtonText: 'Create',
      create
    })
  }
}

export { perfTestSuiteSummaryController }
