import { appConfig } from '~/src/config'
import { fetchTeam } from '~/src/app/teams/helpers/fetch-team'
import { transformTeamToHeadingEntities } from '~/src/app/teams/transformers/transform-team-to-heading-entities'
import { fetchReposForTeam } from '../helpers/fetch-repos-for-team'

const teamController = {
  handler: async (request, h) => {
    const teamId = request.params?.teamId
    const { team } = await fetchTeam(teamId)
    const { services } = await fetchReposForTeam(teamId)

    team.repositories = services

    return h.view('teams/views/team', {
      pageTitle: `${team.name} team`,
      heading: team.name,
      team,
      headingEntities: transformTeamToHeadingEntities(team),
      breadcrumbs: [
        {
          text: 'Teams',
          href: `${appConfig.get('appPathPrefix')}/teams`
        },
        {
          text: team.name
        }
      ]
    })
  }
}

export { teamController }
