import { fetchTeam } from '~/src/server/teams/helpers/fetch-team'
import { transformTeamToHeadingEntities } from '~/src/server/teams/transformers/transform-team-to-heading-entities'
import { fetchGithubArtifacts } from '~/src/server/teams/helpers/fetch-github-artifacts'

const teamController = {
  handler: async (request, h) => {
    const teamId = request.params?.teamId

    const { team } = await fetchTeam(teamId)

    const github = team?.github
    const teamGithubArtifacts = github
      ? await fetchGithubArtifacts(github)
      : null

    const augmentedTeam = {
      ...team,
      ...(teamGithubArtifacts ?? { teamGithubArtifacts })
    }

    return h.view('teams/views/team', {
      pageTitle: `${augmentedTeam.name} team`,
      heading: augmentedTeam.name,
      team: augmentedTeam,
      headingEntities: transformTeamToHeadingEntities(team),
      breadcrumbs: [
        {
          text: 'Teams',
          href: '/teams'
        },
        {
          text: augmentedTeam.name
        }
      ]
    })
  }
}

export { teamController }
