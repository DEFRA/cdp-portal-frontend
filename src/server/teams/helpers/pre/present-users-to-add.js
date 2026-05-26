import uniqBy from 'lodash/uniqBy.js'

import { fetchCdpUser } from '#server/admin/users/helpers/fetch/fetchers.js'
import { saveToCdpTeam } from './save-to-cdp-team.js'

const presentUsersToAdd = {
  method: async (request, h) => {
    const cdpTeam = request.pre?.cdpTeam
    const userIds = request.query?.userIds ?? []

    if (userIds.length) {
      const fetchUserPromises = userIds.map(async (userId) => {
        const user = await fetchCdpUser(userId)
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
