import { fetchScopes } from '~/src/server/admin/permissions/helpers/fetch/fetch-scopes.js'
import { transformTeamToEntityRow } from '~/src/server/admin/teams/transformers/transform-team-to-entity-row.js'

const permissionsListController = {
  handler: async (request, h) => {
    const { scopes } = await fetchScopes()
    const entityRows = scopes?.map(transformTeamToEntityRow)

    return h.view('admin/permissions/views/permissions-list', {
      pageTitle: 'Permissions',
      heading: 'Permissions',
      entityRows,
      noResult: 'Currently there are no custom permissions'
    })
  }
}

export { permissionsListController }
