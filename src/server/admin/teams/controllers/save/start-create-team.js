import { sessionNames } from '../../../../common/constants/session-names.js'

const startCreateTeamController = {
  options: {
    id: 'admin/teams/create'
  },
  handler: async (request, h) => {
    request.yar.clear(sessionNames.validationFailure)

    return h.redirect('/admin/teams/team-details')
  }
}

export { startCreateTeamController }
