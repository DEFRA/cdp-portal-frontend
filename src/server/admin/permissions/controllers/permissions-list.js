import { fetchScopes } from '~/src/server/admin/permissions/helpers/fetchers.js'

const permissionsListController = {
  handler: async (request, h) => {
    const { scopes } = await fetchScopes(request)
    const entityRows = scopes.map((scope) => [
      {
        kind: 'link',
        url: `/admin/permissions/${scope.scopeId}`,
        value: scope.value
      },
      {
        kind: 'text',
        value: scope.description
      }
    ])

    return h.view('admin/permissions/views/permissions-list', {
      pageTitle: 'Permissions',
      heading: 'Permissions',
      entityRows
    })
  }
}

export { permissionsListController }
