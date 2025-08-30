import { fetchCdpUser } from '../../../users/helpers/fetch/index.js'

const provideSelectedUser = {
  method: async (request) => {
    const userId = request.query?.userId ?? request.pre?.stepData?.userId
    const response = userId ? await fetchCdpUser(userId) : null

    return response?.user ?? null
  },
  assign: 'selectedUser'
}

export { provideSelectedUser }
