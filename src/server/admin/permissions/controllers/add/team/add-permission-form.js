import Joi from 'joi'
import Boom from '@hapi/boom'
import uniqBy from 'lodash/uniqBy.js'
import filter from 'lodash/filter.js'

import { formatText } from '~/src/config/nunjucks/filters/index.js'
import { buildOptions } from '~/src/server/common/helpers/options/build-options.js'
import { provideSelectedTeams } from '~/src/server/admin/permissions/helpers/pre/provide-selected-teams.js'
import {
  fetchScope,
  searchCdpTeams
} from '~/src/server/admin/permissions/helpers/fetchers.js'

async function buildTeamsOptions(query, scope, selectedTeams) {
  const foundTeams = []

  if (query) {
    const searchResponse = await searchCdpTeams(query)

    if (searchResponse?.teams?.length) {
      foundTeams.push(...searchResponse.teams)
    }
  }

  // Unique selected teams and search result teams. Don;t show teams that already have the scope
  const teams = filter(
    uniqBy([...selectedTeams, ...foundTeams, ...scope.teams], 'teamId'),
    (team) =>
      !scope.teams?.some((scopeTeam) => scopeTeam.teamId === team.teamId)
  )

  return teams?.length
    ? buildOptions(
        teams.map((cdpTeam) => ({ text: cdpTeam.name, value: cdpTeam.teamId })),
        false
      )
    : null
}

const addPermissionToTeamFormController = {
  options: {
    id: 'admin/permissions/{scopeId}/team/add',
    validate: {
      query: Joi.object({
        teamIds: Joi.array().items(Joi.string().allow('')).single().allow(''),
        cdpTeamQuery: Joi.string().allow('')
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    },
    pre: [provideSelectedTeams]
  },
  handler: async (request, h) => {
    const query = request?.query
    const cdpTeamQuery = query?.cdpTeamQuery || null
    const selectedTeams = request.pre.selectedTeams
    const selectedTeamsIds = selectedTeams.map((team) => team.teamId)

    const { scope } = await fetchScope(request, request.params.scopeId)

    return h.view('admin/permissions/views/add/team/add-permission-form', {
      pageTitle: 'Add Permission to Team',
      formValues: {
        cdpTeamQuery,
        teamIds: selectedTeamsIds
      },
      teams: await buildTeamsOptions(cdpTeamQuery, scope, selectedTeams),
      scope,
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
          text: formatText(scope.value),
          href: '/admin/permissions/' + scope.scopeId
        },
        {
          text: 'Add'
        }
      ]
    })
  }
}

export { addPermissionToTeamFormController }
