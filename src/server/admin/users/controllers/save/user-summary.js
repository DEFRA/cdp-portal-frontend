import { transformSummaryUserRows } from '../../transformers/transform-summary-user-rows.js'

const userSummaryController = {
  handler: (request, h) => {
    const cdpUser = request.app.getStepData()

    return h.view('admin/users/views/save/summary', {
      pageTitle: 'Create User Summary',
      pageHeading: {
        text: cdpUser.name,
        caption: 'Create User Summary'
      },
      userRows: transformSummaryUserRows(cdpUser),
      formButtonText: 'Create',
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
          text: 'Create'
        }
      ]
    })
  }
}

export { userSummaryController }
