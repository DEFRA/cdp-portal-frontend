import { buildLink } from '../../../common/helpers/view/build-link.js'

function transformTeamUsersToTaskList(team, withActions = true) {
  const items = team.users.map((user) => {
    const displayName =
      user.disabled && user.name ? `${user.name} (Disabled)` : user.name

    return {
      title: {
        html: buildLink({
          href: `/admin/users/${user.userId}`,
          text: displayName,
          classes: user.disabled ? 'app-text--muted' : null,
          newTab: false
        })
      },
      status: {
        html: withActions
          ? buildLink({
              href: `/admin/teams/${team.teamId}/remove-member/${user.userId}`,
              text: 'Remove',
              newTab: false
            })
          : null
      }
    }
  })

  return {
    classes: 'app-task-list',
    attributes: { 'data-testid': 'admin-team-members' },
    items
  }
}

export { transformTeamUsersToTaskList }
