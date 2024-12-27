import { buildLink } from '~/src/server/common/helpers/view/build-link.js'

function transformUserTeamsToTaskList(user) {
  const items = user.teams.map((team) => {
    return {
      title: {
        html: buildLink(`/admin/teams/${team.teamId}`, team.name, false)
      }
    }
  })

  return { classes: 'app-task-list govuk-!-margin-bottom-8', items }
}

export { transformUserTeamsToTaskList }
