import { fetchPermissionsScopes } from '../helpers/fetchers.js'

const permissionsListController = {
  handler: async (request, h) => {
    const { scopes } = await fetchPermissionsScopes(request)
    const rows = scopes.map((scope) => ({
      cells: [
        {
          headers: 'value',
          entity: {
            kind: 'link',
            url: `/admin/permissions/${scope.scopeId}`,
            value: scope.value
          }
        },
        {
          headers: 'description',
          entity: {
            kind: 'text',
            value: scope.description
          }
        }
      ]
    }))

    return h.view('admin/permissions/views/permissions-list', {
      pageTitle: 'Permissions',
      tableData: {
        headers: [
          { id: 'value', text: 'Value', width: '20' },
          { id: 'description', text: 'Description', width: '80' }
        ],
        rows,
        noResult: 'No permissions found'
      }
    })
  }
}

export { permissionsListController }
