import { summaryPrototypeRows } from '../transformers/summary-prototype-rows.js'

const prototypeSummaryController = {
  handler: async (request, h) => {
    const create = request.app.getStepData()
    const userSession = request.auth.credentials

    return h.view('create/views/summary', {
      pageTitle: 'Create prototype summary',
      heading: 'Create prototype',
      headingCaption:
        'Information about the new prototype you are going to create',
      action: '/create/prototype',
      summaryRows: summaryPrototypeRows(
        create,
        'prototype',
        userSession?.isAdmin
      ),
      formButtonText: 'Create',
      create
    })
  }
}

export { prototypeSummaryController }
