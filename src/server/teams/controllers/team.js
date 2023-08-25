import { fetchTeam } from '~/src/server/teams/helpers/fetch-team'
import { transformTeamToHeadingEntities } from '~/src/server/teams/transformers/transform-team-to-heading-entities'
import { fetchRepositories } from '~/src/server/common/helpers/fetch-repositories'
import { fetchTemplates } from '~/src/server/common/helpers/fetch-templates'
import { fetchLibraries } from '~/src/server/common/helpers/fetch-libraries'

const teamController = {
  handler: async (request, h) => {
    const teamId = request.params?.teamId

    let { team } = await fetchTeam(teamId)
    const { repositories } = await fetchRepositories(teamId)
    const { templates } = await fetchTemplates(teamId)
    const { libraries } = await fetchLibraries(teamId)

    team = {
      ...team,
      repositories,
      templates,
      libraries
    }

    return h.view('teams/views/team', {
      pageTitle: `${team.name} team`,
      heading: team.name,
      team,
      headingEntities: transformTeamToHeadingEntities(team),
      breadcrumbs: [
        {
          text: 'Teams',
          href: '/teams'
        },
        {
          text: team.name
        }
      ]
    })
  }
}

export { teamController }
