import Joi from 'joi'
import Boom from '@hapi/boom'
import uniqBy from 'lodash/uniqBy.js'
import filter from 'lodash/filter.js'

import { formatText } from '~/src/config/nunjucks/filters/index.js'
import { buildOptions } from '~/src/server/common/helpers/options/build-options.js'
import { presentTeamsToAdd } from '~/src/server/admin/permissions/helpers/pre/present-teams-to-add.js'
import {
  fetchScope,
  searchCdpTeams
} from '~/src/server/admin/permissions/helpers/fetchers.js'

const addPermissionFormController = {
  options: {
    id: 'admin/permissions/{scopeId}/add',
    validate: {
      query: Joi.object({
        teamIds: Joi.array().items(Joi.string().allow('')).single().allow(''),
        cdpTeamQuery: Joi.string().allow('')
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    },
    pre: [presentTeamsToAdd]
  },
  handler: async (request, h) => {
    const teamsToAdd = request.pre?.teamsToAdd

    const query = request?.query
    const cdpTeamQuery = query?.cdpTeamQuery || null

    const { scope } = await fetchScope(request, request.params.scopeId)

    const searchCdpTeamsResponse = cdpTeamQuery
      ? await searchCdpTeams(cdpTeamQuery)
      : null
    const cdpTeams = searchCdpTeamsResponse?.teams ?? []

    const teamIds = teamsToAdd.map((team) => team.teamId)

    const allTeams = filter(
      uniqBy([...teamsToAdd, ...cdpTeams], 'teamId'),
      (team) =>
        !scope.teams?.some((scopeTeam) => scopeTeam.teamId === team.teamId)
    )
    const title = 'Add'
    const formattedValue = formatText(scope.value)

    return h.view('admin/permissions/views/add/add-permission-form', {
      pageTitle: title,
      formValues: {
        cdpTeamQuery,
        teamIds
      },
      cdpTeams: allTeams?.length
        ? buildOptions(
            allTeams.map((cdpTeam) => ({
              text: cdpTeam.name,
              value: cdpTeam.teamId
            })),
            false
          )
        : null,
      scope,
      teamsToAdd: teamsToAdd.map((team) => team.name),
      breadcrumbs: [
        {
          text: 'Admin',
          href: '/admin'
        },
        {
          text: 'Permissions',
          href: '/admin/permissions'
        },
        {
          text: formattedValue,
          href: '/admin/permissions/' + scope.scopeId
        },
        {
          text: title
        }
      ]
    })
  }
}

export { addPermissionFormController }
