import { fetchPermissions } from '../helpers/fetchers.js'
import { noValue } from '../../../common/constants/no-value.js'
import { renderTag } from '../../../common/helpers/view/render-tag.js'
import { renderComponent } from '../../../common/helpers/nunjucks/render-component.js'

const permissionsListController = {
  handler: async (request, h) => {
    const userTagComponent = renderComponent(
      'tool-tip',
      { text: 'A user permission is for an individual user' },
      [
        renderTag({
          text: 'User',
          classes: ['govuk-tag--green govuk-!-margin-bottom-1']
        })
      ]
    )
    const teamTagComponent = renderComponent(
      'tool-tip',
      { text: "A team permissions includes all member's of a team" },
      [
        renderTag({
          text: 'Team',
          classes: ['govuk-tag--blue govuk-!-margin-bottom-1']
        })
      ]
    )
    const memberTagComponent = renderComponent(
      'tool-tip',
      { text: 'A member permissions is for a user scoped to a team' },
      [
        renderTag({
          text: 'Member',
          classes: ['app-tag--purple']
        })
      ]
    )

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
