import { appConfig } from '~/src/config'
import { fetchTeam } from '~/src/app/teams/helpers/fetch-team'
import { transformTeamToHeadingEntities } from '~/src/app/teams/transformers/transform-team-to-heading-entities'

const teamController = {
  handler: async (request, h) => {
    const { team } = await fetchTeam(request.params?.teamId)

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
