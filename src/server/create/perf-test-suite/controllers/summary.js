import { provideCreate } from '~/src/server/create/helpers/pre/provide-create'
import { noSessionRedirect } from '~/src/server/create/helpers/ext/no-session-redirect'
import { summaryPerfTestSuiteRows } from '~/src/server/create/perf-test-suite/transformers/summary-perf-test-suite-rows'

const perfTestSuiteSummaryController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideCreate]
  },
  handler: (request, h) => {
    const create = request.pre?.create

    return h.view('create/views/summary', {
      pageTitle: 'Summary performance test suite',
      heading: 'Summary performance test suite',
      headingCaption:
        'Information about the new performance test suite you are going to create.',
      action: '/create/perf-test-suite',
      summaryRows: summaryPerfTestSuiteRows(create),
      formButtonText: 'Create',
      create
    })
  }
}

export { perfTestSuiteSummaryController }
