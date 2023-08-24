import { noSessionRedirect } from '~/src/server/admin/users/helpers/prerequisites/no-session-redirect'
import { provideCdpUser } from '~/src/server/admin/users/helpers/prerequisites/provide-cdp-user'
import { transformSummaryUserRows } from '~/src/server/admin/users/transformers/transform-summary-user-rows'
import { setStepComplete } from '~/src/server/admin/users/helpers/set-step-complete'
import { appConfig } from '~/src/config'

const summaryController = {
  options: {
    pre: [noSessionRedirect, provideCdpUser]
  },
  handler: async (request, h) => {
    setStepComplete(request, 'stepThree')

    const cdpUser = request.pre?.cdpUser
    const isEdit = cdpUser.isEdit ?? false

    const heading = isEdit ? 'Update user summary' : 'Create user summary'

    return h.view('admin/users/views/summary', {
      pageTitle: heading,
      heading,
      headingCaption: 'Information about the user you are going to create.',
      userRows: await transformSummaryUserRows(cdpUser),
      formButtonText: isEdit ? 'Update' : 'Create',
      isEdit,
      breadcrumbs: [
        {
          text: 'Admin',
          href: appConfig.get('appPathPrefix') + '/admin'
        },
        {
          text: 'Users',
          href: appConfig.get('appPathPrefix') + '/admin/teams'
        },
        {
          text: isEdit ? 'Update' : 'Create' + ' user'
        }
      ]
    })
  }
}

export { summaryController }
