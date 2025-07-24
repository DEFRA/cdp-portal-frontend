import { fetchCdpUsers } from '../helpers/fetch/index.js'
import { transformUserToEntityRow } from '../transformers/transform-user-to-entity-row.js'

const usersListController = {
  handler: async (request, h) => {
    const { payload } = await fetchCdpUsers()
    const rows = payload?.users.map(transformUserToEntityRow)

    return h.view('admin/users/views/users-list', {
      pageTitle: 'Users',
      tableData: {
        headers: [
          { id: 'name', text: 'Name', width: '15' },
          { id: 'email', text: 'Email', width: '15' },
          { id: 'github-user', text: 'GitHub user', width: '15' },
          { id: 'last-updated', text: 'Last Updated', width: '10' },
          { id: 'created', text: 'Created', width: '10' }
        ],
        rows,
        noResult: 'No users found'
      }
    })
  }
}

export { usersListController }
