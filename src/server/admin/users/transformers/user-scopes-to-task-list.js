import { buildLink } from '../../../common/helpers/view/build-link.js'

function transformUserScopesToTaskList(team) {
  const items =
    team.scopes?.map((scope) => {
      return {
        title: {
          html: buildLink({
            href: `/admin/permissions/${scope.scopeId}`,
            text: scope.scopeName,
            newTab: false
          })
        }
      }
    }) ?? []

  return { classes: 'app-task-list', items }
}

export { transformUserScopesToTaskList }
