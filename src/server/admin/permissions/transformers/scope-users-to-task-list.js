import { buildLink } from '~/src/server/common/helpers/view/build-link.js'

function transformScopeUsersToTaskList(scope, withActions = true) {
  const items = scope.users.map((user) => {
    return {
      title: {
        html: buildLink(`/admin/users/${user.userId}`, user.name, false)
      },
      status: {
        html: withActions
          ? buildLink(
              `/admin/permissions/${scope.scopeId}/user/remove/${user.userId}`,
              'Remove',
              false
            )
          : null
      }
    }
  })

  return { classes: 'app-task-list', items }
}

export { transformScopeUsersToTaskList }
