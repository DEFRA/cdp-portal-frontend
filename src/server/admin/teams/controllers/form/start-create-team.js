import { config } from '~/src/config'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { saveToCdpTeam } from '~/src/server/admin/teams/helpers/form'

const startCreateTeamController = {
  handler: async (request, h) => {
    request.yar.clear(sessionNames.cdpTeam)
    request.yar.clear(sessionNames.validationFailure)
    await request.yar.commit(h)

    await saveToCdpTeam(request, h, {})

    return h.redirect(config.get('appPathPrefix') + '/admin/teams/team-details')
  }
}

export { startCreateTeamController }
