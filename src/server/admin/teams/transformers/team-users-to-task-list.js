import { buildLink } from '~/src/server/common/helpers/view/build-link.js'

function transformTeamUsersToTaskList(team, withActions = true) {
  const items = team.users.map((user) => {
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
