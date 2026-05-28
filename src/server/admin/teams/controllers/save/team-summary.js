import { transformSummaryTeamRows } from '../../transformers/transform-summary-team-rows.js'

const teamSummaryController = {
  handler: (request, h) => {
    const cdpTeam = request.app.getStepData()
    const isEdit = cdpTeam.isEdit ?? false
    const updateOrCreate = isEdit ? 'Edit' : 'Create'

    return h.view('admin/teams/views/save/summary', {
      pageTitle: `${updateOrCreate} Team Summary`,
      teamRows: transformSummaryTeamRows(cdpTeam),
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
