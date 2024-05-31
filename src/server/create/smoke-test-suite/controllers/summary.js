import { provideCreate } from '~/src/server/create/helpers/pre/provide-create'
import { noSessionRedirect } from '~/src/server/create/helpers/ext/no-session-redirect'
import { summarySmokeTestSuiteRows } from '~/src/server/create/smoke-test-suite/transformers/summary-smoke-test-suite-rows'

const smokeTestSuiteSummaryController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideCreate]
  },
  handler: (request, h) => {
    const create = request.pre?.create

    return h.view('create/views/summary', {
      pageTitle: 'Summary smoke test suite',
      heading: 'Summary smoke test suite',
      headingCaption:
        'Information about the new smoke test suite you are going to create.',
      action: '/create/smoke-test-suite',
      summaryRows: summarySmokeTestSuiteRows(create),
      formButtonText: 'Create',
      create
    })
  }
}

export { smokeTestSuiteSummaryController }
