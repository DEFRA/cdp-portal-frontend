import { config } from '#config/config.js'
import { sessionNames } from '#server/common/constants/session-names.js'
import { removeNil } from '#server/common/helpers/remove-nil.js'
import { addMemberToTeam } from '#server/admin/teams/helpers/fetch/fetchers.js'

export const createUsersController = {
  handler: async (request, h) => {
    const { usersToCreate = [], teamsToAssign = [] } = request.app.getStepData()

    const createUserEndpointUrl = `${config.get('userServiceBackendUrl')}/users`

    try {
      // Create all users
      for (const user of usersToCreate) {
        await request.authedFetchJson(createUserEndpointUrl, {
          method: 'post',
          payload: removeNil({
            userId: user.userId,
            name: user.name,
            email: user.email,
            github: user.github
          })
        })
      }

      // Add all users to each selected team
      for (const user of usersToCreate) {
        for (const teamId of teamsToAssign) {
          await addMemberToTeam(request, teamId, user.userId)
        }
      }

      request.yar.flash(sessionNames.notifications, {
        text: 'Users created',
        type: 'success'
      })

      return h.redirect('/admin/users')
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect('/admin/users/summary')
    }
  }
}
