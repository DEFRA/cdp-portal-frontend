import { provideStepData } from '#server/plugins/multistep-form/provide-step-data.js'
import Joi from 'joi'
import { transformSummaryUserRows } from '../../transformers/transform-summary-user-rows.js'

const userSummaryController = {
  options: {
    pre: [provideStepData],
    validate: {
      params: Joi.object({
        multiStepFormId: Joi.string().uuid().optional()
      })
    }
  },
  handler: (request, h) => {
    const cdpUser = request.pre?.stepData
    const multiStepFormId = request.app.multiStepFormId

    return h.view('admin/users/views/save/summary', {
      pageTitle: 'Create User Summary',
      pageHeading: {
        text: cdpUser.name,
        caption: 'Create User Summary'
      },
      multiStepFormId,
      userRows: transformSummaryUserRows(cdpUser, multiStepFormId),
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
