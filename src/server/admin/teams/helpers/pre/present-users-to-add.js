import { uniqBy } from 'lodash'

import { fetchCdpUser } from '~/src/server/admin/users/helpers/fetch'
import { saveToCdpTeam } from '~/src/server/admin/teams/helpers/form'

const presentUsersToAdd = {
  method: async (request, h) => {
    const cdpTeam = request.pre?.cdpTeam
    const userIds = request.query?.userIds ?? []

    if (userIds.length) {
      const fetchUserPromises = userIds.map(async (userId) => {
        const { user } = await fetchCdpUser(userId)
        return { name: user.name, email: user.email, userId: user.userId }
      })

      const usersToAdd = await Promise.all(fetchUserPromises)

      await saveToCdpTeam(request, h, {
        usersToAdd: uniqBy(
          [...usersToAdd, ...(cdpTeam?.usersToAdd ? cdpTeam.usersToAdd : [])],
          'userId'
        )
      })

      return usersToAdd
    }

    await saveToCdpTeam(request, h, { usersToAdd: [] })

    return []
  },
  assign: 'usersToAdd'
}

export { presentUsersToAdd }
