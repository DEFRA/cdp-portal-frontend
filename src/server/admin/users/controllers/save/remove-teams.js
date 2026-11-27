import Joi from 'joi'
import Boom from '@hapi/boom'

const removeTeamController = {
  options: {
    validate: {
      payload: Joi.object({
        teamId: Joi.string().required()
      }).unknown(true),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const { teamId } = request.payload
    const stepData = request.app.getStepData()

    const teamsToAssign = (stepData.teamsToAssign ?? []).filter(
      (id) => id !== teamId
    )

    await request.app.initStepData({
      ...stepData,
      teamsToAssign
    })

    return h.redirect('/admin/users/summary')
  }
}

export { removeTeamController }
