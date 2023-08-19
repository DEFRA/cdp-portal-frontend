import { noSessionRedirect } from '~/src/server/admin/users/helpers/prerequisites/no-session-redirect'
import { provideCdpUser } from '~/src/server/admin/users/helpers/prerequisites/provide-cdp-user'
import { transformSummaryUserRows } from '~/src/server/admin/users/transformers/transform-summary-user-rows'

const summaryController = {
  options: {
    pre: [noSessionRedirect, provideCdpUser]
  },
  handler: async (request, h) => {
    const cdpUser = request.pre?.cdpUser

    return h.view('admin/users/views/summary', {
      pageTitle: 'Create User Summary',
      heading: 'Summary',
      headingCaption: 'Information about the user you are going to create.',
      userRows: await transformSummaryUserRows(cdpUser),
      formButtonText: 'Create'
    })
  }
}

export { summaryController }
