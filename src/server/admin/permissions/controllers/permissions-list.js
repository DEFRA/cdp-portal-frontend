import { fetchPermissions } from '../helpers/fetchers.js'
import { noValue } from '../../../common/constants/no-value.js'
import {
  memberTagComponent,
  teamTagComponent,
  userTagComponent
} from '../helpers/permission-tags.js'

const permissionsListController = {
  handler: async (request, h) => {
    const scopes = await fetchPermissions(request)
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
          headers: 'kind',
          html: scope.kind
            ? scope.kind
                ?.map((kind) => {
                  if (kind === 'user') {
                    return userTagComponent
                  }

                  if (kind === 'member') {
                    return memberTagComponent
                  }

                  return teamTagComponent
                })
                .sort()
                .join('')
            : noValue
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
          { id: 'kind', text: 'Applicable to', width: '10' },
          { id: 'description', text: 'Description', width: '70' }
        ],
        rows,
        noResult: 'No permissions found'
      }
    })
  }
}

export { permissionsListController }
