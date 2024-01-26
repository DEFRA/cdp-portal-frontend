import { provideCreate } from '~/src/server/create/helpers/pre/provide-create'
import { noSessionRedirect } from '~/src/server/create/helpers/ext/no-session-redirect'
import { summaryEnvTestSuiteRows } from '~/src/server/create/env-test-suite/transformers/summary-env-test-suite-rows'

const envTestSuiteSummaryController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideCreate]
  },
  handler: (request, h) => {
    const create = request.pre?.create

    return h.view('create/views/summary', {
      pageTitle: 'Summary environment test suite summary',
      heading: 'Summary environment test suite',
      headingCaption:
        'Information about the new environment test suite you are going to create.',
      action: '/create/env-test-suite',
      summaryRows: summaryEnvTestSuiteRows(create),
      formButtonText: 'Create',
      create
    })
  }
}

export { envTestSuiteSummaryController }
