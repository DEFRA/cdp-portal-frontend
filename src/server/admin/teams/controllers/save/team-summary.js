import { provideStepData } from '#server/plugins/multistep-form/provide-step-data.js'
import Joi from 'joi'
import { transformSummaryTeamRows } from '../../transformers/transform-summary-team-rows.js'

const teamSummaryController = {
  options: {
    pre: [provideStepData],
    validate: {
      params: Joi.object({
        multiStepFormId: Joi.string().uuid().optional()
      })
    }
  },
  handler: (request, h) => {
    const cdpTeam = request.pre?.stepData
    const multiStepFormId = request.app.multiStepFormId
    const isEdit = cdpTeam.isEdit ?? false
    const updateOrCreate = isEdit ? 'Edit' : 'Create'

    return h.view('admin/teams/views/save/summary', {
      pageTitle: `${updateOrCreate} Team Summary`,
      multiStepFormId,
      teamRows: transformSummaryTeamRows(cdpTeam, multiStepFormId),
      formButtonText: isEdit ? 'Save' : 'Create',
      pageHeading: {
        text: cdpTeam.name,
        caption: isEdit ? 'Edit Team Summary' : 'Create Team Summary'
      },
      isEdit,
      splitPaneBreadcrumbs: [
        {
          text: 'Admin',
          href: '/admin'
        },
        {
          text: 'Teams',
          href: '/admin/teams'
        },
        {
          text: updateOrCreate
        }
      ]
    })
  }
}

export { teamSummaryController }
