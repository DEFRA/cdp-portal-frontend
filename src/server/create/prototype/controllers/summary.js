import { provideCreate } from '../../helpers/pre/provide-create.js'
import { noSessionRedirect } from '../../helpers/ext/no-session-redirect.js'
import { summaryPrototypeRows } from '../transformers/summary-prototype-rows.js'

const prototypeSummaryController = {
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
