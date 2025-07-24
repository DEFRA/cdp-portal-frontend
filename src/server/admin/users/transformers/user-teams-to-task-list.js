import { buildLink } from '../../../common/helpers/view/build-link.js'

function transformUserTeamsToTaskList(user) {
  const items = user.teams.map((team) => {
    return {
      title: {
        html: buildLink({
          href: `/admin/teams/${team.teamId}`,
          text: team.name,
          newTab: false
        })
      }
    }
  })

  return { classes: 'app-task-list', items }
}

export { transformUserTeamsToTaskList }
