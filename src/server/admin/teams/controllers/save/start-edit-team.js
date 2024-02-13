import Joi from 'joi'
import Boom from '@hapi/boom'

import { sessionNames } from '~/src/server/common/constants/session-names'
import { fetchCdpTeam } from '~/src/server/admin/teams/helpers/fetch'

const startEditTeamController = {
  options: {
    validate: {
      params: Joi.object({
        teamId: Joi.string().guid().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const { team } = await fetchCdpTeam(request.params?.teamId)

    request.yar.set(sessionNames.cdpTeam, {
      ...team,
      isEdit: true
    })
    request.yar.clear(sessionNames.validationFailure)
    await request.yar.commit(h)

    return h.redirect('/admin/teams/team-details')
  }
}

export { startEditTeamController }
