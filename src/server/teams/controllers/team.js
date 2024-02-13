import Joi from 'joi'
import Boom from '@hapi/boom'
import { omit } from 'lodash'

import {
  fetchTeam,
  fetchGithubArtifacts
} from '~/src/server/teams/helpers/fetch'
import { teamUsers } from '~/src/server/teams/transformers/team-users'
import { teamToHeadingEntities } from '~/src/server/teams/transformers/team-to-heading-entities'
import { teamToEntityDataList } from '~/src/server/teams/transformers/team-to-entity-data-list'
import { teamRepositories } from '~/src/server/teams/transformers/team-repositories'
import { teamTemplates } from '~/src/server/teams/transformers/team-templates'
import { teamLibraries } from '~/src/server/teams/transformers/team-libraries'

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
      entityDataList: teamToEntityDataList(team),
      headingEntities: teamToHeadingEntities(team),
      teamMembers: teamUsers(team, hasTeamScope),
      teamRepositories: teamRepositories(teamWithGithubArtifacts?.repositories),
      teamTemplates: teamTemplates(teamWithGithubArtifacts?.templates),
      teamLibraries: teamLibraries(teamWithGithubArtifacts?.libraries),
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
