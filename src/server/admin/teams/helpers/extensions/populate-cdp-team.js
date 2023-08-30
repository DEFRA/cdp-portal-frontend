import { fetchCdpTeam } from '~/src/server/admin/teams/helpers/fetch-cdp-team'
import { saveToCdpTeam } from '~/src/server/admin/teams/helpers/save-to-cdp-team'
import { sessionNames } from '~/src/server/common/constants/session-names'

const populateCdpTeam = {
  method: async (request, h) => {
    const teamId = request.params.teamId

    request.yar.clear(sessionNames.cdpTeam)

    if (teamId) {
      const { team } = await fetchCdpTeam(teamId)
      saveToCdpTeam(request, { ...team, isEdit: true })
    }

    return h.continue
  }
}

export { populateCdpTeam }
