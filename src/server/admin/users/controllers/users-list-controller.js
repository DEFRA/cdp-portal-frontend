import { sortBy } from '~/src/server/common/helpers/sort-by'
import { fetchUsers } from '~/src/server/admin/users/helpers/fetch-users'
import { transformUserToEntityRow } from '~/src/server/admin/users/transformers/transform-user-to-entity-row'

const usersListController = {
  handler: async (request, h) => {
    const { users } = await fetchUsers()

    const entityRows = users
      ?.sort(sortBy('name', 'asc'))
      ?.map(transformUserToEntityRow)

    return h.view('admin/users/views/users-list', {
      pageTitle: 'Users',
      heading: 'Users',
      entityRows,
      headingCaption: 'CDP Portal Users',
      noResult: 'Currently there are no users'
    })
  }
}

export { usersListController }
