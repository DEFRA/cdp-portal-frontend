import { summaryTestSuiteRows } from '../../helpers/transformers/summary-test-suite-rows.js'

const testSuiteSummaryController = {
  handler: async (request, h) => {
    const create = request.app.getStepData()
    const userSession = request.auth.credentials

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
