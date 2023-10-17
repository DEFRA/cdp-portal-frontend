import Joi from 'joi'
import Boom from '@hapi/boom'

import { config } from '~/src/config'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { fetchCdpTeam } from '~/src/server/admin/teams/helpers'

const teamEditStartController = {
  options: {
    validate: {
      params: Joi.object({
        teamId: Joi.string().guid().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const teamId = request.params?.teamId
    const { team } = await fetchCdpTeam(teamId)

    request.yar.set(sessionNames.cdpTeam, {
      ...team
    })
    request.yar.clear(sessionNames.validationFailure)
    await request.yar.commit(h)

    return h.redirect(
      config.get('appPathPrefix') + `/teams/${teamId}/team-details`
    )
  }
}

export { teamEditStartController }
