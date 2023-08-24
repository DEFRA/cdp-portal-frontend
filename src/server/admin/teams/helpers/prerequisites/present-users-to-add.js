import { uniqBy } from 'lodash'

import { fetchUser } from '~/src/server/admin/users/helpers/fetch-user'
import { saveToCdpTeam } from '~/src/server/admin/teams/helpers/save-to-cdp-team'

const presentUsersToAdd = {
  method: async (request) => {
    const cdpTeam = request.pre?.cdpTeam
    const userIds = request.query?.userIds ?? []

    if (userIds.length) {
      const fetchUserPromises = userIds.map(async (userId) => {
        const { user } = await fetchUser(userId)
        return { name: user.name, email: user.email, userId: user.userId }
      })

      const usersToAdd = await Promise.all(fetchUserPromises)

      saveToCdpTeam(request, {
        usersToAdd: uniqBy(
          [...usersToAdd, ...(cdpTeam?.usersToAdd ? cdpTeam.usersToAdd : [])],
          'userId'
        )
      })

      return usersToAdd
    }

    saveToCdpTeam(request, { usersToAdd: [] })

    return []
  },
  assign: 'usersToAdd'
}

export { presentUsersToAdd }
