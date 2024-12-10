import { fetchCdpUser } from '~/src/server/admin/users/helpers/fetch/index.js'

const provideSelectedUsers = {
  method: async (request) => {
    const userIds = request.query?.userIds ?? []

    if (userIds.length) {
      const fetchUsersPromises = userIds.map(async (userId) => {
        const { user } = await fetchCdpUser(userId)
        return { name: user.name, userId: user.userId }
      })

      return Promise.all(fetchUsersPromises)
    }

    return []
  },
  assign: 'selectedUsers'
}

export { provideSelectedUsers }
