import { fetchTeam } from '~/src/server/teams/helpers/fetch-team'
import { transformTeamToHeadingEntities } from '~/src/server/teams/transformers/transform-team-to-heading-entities'
import { fetchRepositories } from '~/src/server/common/helpers/fetch-repositories'
import { fetchTemplates } from '~/src/server/common/helpers/fetch-templates'
import { fetchLibraries } from '~/src/server/common/helpers/fetch-libraries'

const teamController = {
  handler: async (request, h) => {
    const teamId = request.params?.teamId

    const { team } = await fetchTeam(teamId)

    const github = team?.github
    const repositoriesResponse = github ? await fetchRepositories(github) : null
    const templatesResponse = github ? await fetchTemplates(github) : null
    const librariesResponse = github ? await fetchLibraries(github) : null

    const augmentedTeam = {
      ...team,
      repositories: repositoriesResponse?.repositories,
      templates: templatesResponse?.templates,
      libraries: librariesResponse?.libraries,
      ...(team.users?.length && {
        users: team.users.sort((a, b) => a.name.localeCompare(b.name))
      })
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
