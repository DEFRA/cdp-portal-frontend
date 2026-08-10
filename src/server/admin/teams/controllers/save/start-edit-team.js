import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchCdpTeam } from '../../helpers/fetch/fetchers.js'
import { teamIdValidation } from '@defra/cdp-validation-kit'
import { sessionNames } from '#server/common/constants/session-names.js'

const startEditTeamController = {
  options: {
    validate: {
      params: Joi.object({
        teamId: teamIdValidation
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    request.yar.clear(sessionNames.validationFailure)
    const team = await fetchCdpTeam(request.params?.teamId)

    // Reset the multi-step form
    await request.app.initStepData()

    const data = {
      ...team,
      // user-service-backend supports multiple service codes - we want to just allow one service code for now
      ...(team.serviceCodes?.at(0) && { serviceCode: team.serviceCodes.at(0) }),
      isEdit: true
    }

    // Update multi-step with existing data
    await request.app.initStepData(data)
    await request.yar.commit(h)

    return h.redirect(`/admin/teams/team-details`)
  }
}

export { startEditTeamController }
