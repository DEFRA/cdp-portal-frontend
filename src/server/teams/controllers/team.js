import Joi from 'joi'
import Boom from '@hapi/boom'
import { omit } from 'lodash'

import { fetchTeam } from '~/src/server/teams/helpers/fetch-team'
import { fetchGithubArtifacts } from '~/src/server/teams/helpers/fetch-github-artifacts'
import { transformTeamUsers } from '~/src/server/teams/transformers/transform-team-users'
import { transformTeamToHeadingEntities } from '~/src/server/teams/transformers/transform-team-to-heading-entities'
import { transformTeamToEntityDataList } from '~/src/server/teams/transformers/transform-team-to-entity-data-list'
import { transformTeamRepositories } from '~/src/server/teams/transformers/transform-team-repositories'
import { transformTeamTemplates } from '~/src/server/teams/transformers/transform-team-templates'
import { transformTeamLibraries } from '~/src/server/teams/transformers/transform-team-libraries'

const teamController = {
  options: {
    validate: {
      params: Joi.object({
        teamId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const teamId = request.params?.teamId
    const hasTeamScope = await request.userHasTeamScope(teamId)

    const { team } = await fetchTeam(teamId)

    const github = team?.github
    const githubArtifacts = github ? await fetchGithubArtifacts(github) : null

    const teamWithGithubArtifacts = {
      ...team,
      ...(githubArtifacts && omit(githubArtifacts, 'message'))
    }

    return h.view('teams/views/team', {
      pageTitle: `${teamWithGithubArtifacts.name} team`,
      heading: teamWithGithubArtifacts.name,
      team: teamWithGithubArtifacts,
      entityDataList: transformTeamToEntityDataList(team),
      headingEntities: transformTeamToHeadingEntities(team),
      teamMembers: transformTeamUsers(team, hasTeamScope),
      teamRepositories: transformTeamRepositories(
        teamWithGithubArtifacts?.repositories
      ),
      teamTemplates: transformTeamTemplates(teamWithGithubArtifacts?.templates),
      teamLibraries: transformTeamLibraries(teamWithGithubArtifacts?.libraries),
      breadcrumbs: [
        {
          text: 'Teams',
          href: '/teams'
        },
        {
          text: teamWithGithubArtifacts.name
        }
      ]
    })
  }
}

export { teamController }
