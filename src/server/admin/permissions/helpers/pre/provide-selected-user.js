import { fetchCdpUser } from '../../../users/helpers/fetch/index.js'

const provideSelectedUser = {
  method: async (request) => {
    const entityId = request.query?.entityId
    const response = entityId ? await fetchCdpUser(entityId) : null

    return response?.user ?? null
  },
  assign: 'selectedUser'
}

export { provideSelectedUser }
