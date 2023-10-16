import { noSessionRedirect } from '~/src/server/admin/users/helpers/ext/no-session-redirect'
import { provideCdpUser } from '~/src/server/admin/users/helpers/prerequisites/provide-cdp-user'
import { transformSummaryUserRows } from '~/src/server/admin/users/transformers/transform-summary-user-rows'

const userSummaryController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideCdpUser]
  },
  handler: async (request, h) => {
    const cdpUser = request.pre?.cdpUser
    const isEdit = cdpUser.isEdit ?? false

    const heading = isEdit ? 'Edit user summary' : 'Create user summary'

    return h.view('admin/users/views/save/summary', {
      pageTitle: heading,
      heading,
      headingCaption: 'Information about the user you are going to create.',
      userRows: transformSummaryUserRows(cdpUser),
      formButtonText: isEdit ? 'Save' : 'Create',
      isEdit,
      breadcrumbs: [
        {
          text: 'Admin',
          href: '/admin'
        },
        {
          text: 'Users',
          href: '/admin/users'
        },
        {
          text: `${isEdit ? 'Edit' : 'Create'} user`
        }
      ]
    })
  }
}

export { userSummaryController }
