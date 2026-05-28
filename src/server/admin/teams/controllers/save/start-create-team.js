import { sessionNames } from '#server/common/constants/session-names.js'

const startCreateTeamController = {
  options: {
    id: 'admin/teams/create'
  },
  handler: async (request, h) => {
    await request.app.initStepData()

    return h.redirect('/admin/teams/team-details')
  }
}

export { startCreateTeamController }
