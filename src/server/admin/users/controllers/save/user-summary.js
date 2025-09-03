import { noSessionRedirect } from '../../helpers/ext/no-session-redirect.js'
import { provideCdpUser } from '../../helpers/pre/provide-cdp-user.js'
import { transformSummaryUserRows } from '../../transformers/transform-summary-user-rows.js'

const userSummaryController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideCdpUser]
  },
  handler: (request, h) => {
    const cdpUser = request.pre?.cdpUser
    const isEdit = cdpUser.isEdit ?? false

    const pageTitle = isEdit ? 'Edit User Summary' : 'Create User Summary'

    return h.view('admin/users/views/save/summary', {
      pageTitle,
      pageHeading: {
        text: cdpUser.name,
        caption: pageTitle
      },
      userRows: transformSummaryUserRows(cdpUser),
      formButtonText: isEdit ? 'Save' : 'Create',
      isEdit,
      splitPaneBreadcrumbs: [
        {
          text: 'Admin',
          href: '/admin'
        },
        {
          text: 'Users',
          href: '/admin/users'
        },
        {
          text: isEdit ? 'Edit' : 'Create'
        }
      ]
    })
  }
}

export { userSummaryController }
