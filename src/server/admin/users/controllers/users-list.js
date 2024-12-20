import { fetchCdpUsers } from '~/src/server/admin/users/helpers/fetch/index.js'
import { transformUserToEntityRow } from '~/src/server/admin/users/transformers/transform-user-to-entity-row.js'

const usersListController = {
  handler: async (request, h) => {
    const { users } = await fetchCdpUsers()

    const entityRows = users?.map(transformUserToEntityRow)

    return h.view('admin/users/views/users-list', {
      pageTitle: 'Users',
      entityRows,
      noResult: 'Currently there are no users'
    })
  }
}

export { usersListController }
