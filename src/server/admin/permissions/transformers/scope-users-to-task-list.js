import { buildLink } from '~/src/server/common/helpers/view/build-link.js'

function transformScopeUsersToTaskList(scope, withActions = true) {
  const items = scope.users.map((user) => {
    return {
      title: {
        html: buildLink({
          href: `/admin/users/${user.userId}`,
          text: user.name,
          newTab: false
        })
      },
      status: {
        html: withActions
          ? buildLink({
              href: `/admin/permissions/${scope.scopeId}/user/remove/${user.userId}`,
              text: 'Remove',
              newTab: false
            })
          : null
      }
    }
  })

  return { classes: 'app-task-list', items }
}

export { transformScopeUsersToTaskList }
