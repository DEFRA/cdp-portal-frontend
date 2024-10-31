import Joi from 'joi'
import Boom from '@hapi/boom'
import omit from 'lodash/omit.js'

import {
  fetchTeam,
  fetchGithubArtifacts
} from '~/src/server/teams/helpers/fetch/index.js'
import { teamToHeadingEntities } from '~/src/server/teams/transformers/team-to-heading-entities.js'
import { teamToEntityDataList } from '~/src/server/teams/transformers/team-to-entity-data-list.js'

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
      teamRepositories: teamWithGithubArtifacts?.repositories ?? [],
      teamTemplates: teamWithGithubArtifacts?.templates ?? [],
      teamLibraries: teamWithGithubArtifacts?.libraries ?? [],
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
