import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchCdpTeams } from '#server/admin/teams/helpers/fetch/fetchers.js'

const addTeamsFormController = {
  options: {
    validate: {
      query: Joi.object({
        teamQuery: Joi.string().allow(''),
        teamIds: Joi.array().items(Joi.string()).single().default([]),
        teamSearchSubmitted: Joi.string().valid('true')
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const stepData = request.app.getStepData()

    const allTeams = await fetchCdpTeams()

    const teamQuery = request.query.teamQuery ?? ''

    // Use submitted selections during a search, otherwise restore session selections
    const requestedTeamIds =
      request.query.teamSearchSubmitted === 'true'
        ? request.query.teamIds
        : (stepData.teamsToAssign ?? [])

    const availableTeamIds = new Set(allTeams.map((team) => team.teamId))

    const selectedTeamIds = [...new Set(requestedTeamIds)].filter((teamId) =>
      availableTeamIds.has(teamId)
    )

    const searchTerm = teamQuery.trim().toLowerCase()

    const filteredTeams = [...allTeams]
      .filter((team) => team.name.toLowerCase().includes(searchTerm))
      .sort((a, b) => a.name.localeCompare(b.name))

    const visibleTeamIds = new Set(filteredTeams.map((team) => team.teamId))

    // Preserve selected teams that are not currently visible in search results
    const hiddenSelectedTeamIds = selectedTeamIds.filter(
      (teamId) => !visibleTeamIds.has(teamId)
    )

    const teamOptions = filteredTeams.map((team) => ({
      text: team.name,
      value: team.teamId,
      checked: selectedTeamIds.includes(team.teamId)
    }))

    return h.view('admin/users/views/save/add-teams-form', {
      pageTitle: 'Add teams',
      pageHeading: {
        text: 'Add teams'
      },
      formValues: {
        teamQuery
      },
      teams: teamOptions,
      teamsSelectedCount: selectedTeamIds.length,
      hiddenSelectedTeamIds,
      splitPaneBreadcrumbs: [
        { text: 'Admin', href: '/admin' },
        { text: 'Users', href: '/admin/users' },
        { text: 'Add users', href: '/admin/users/summary' },
        { text: 'Add teams' }
      ]
    })
  }
}

export { addTeamsFormController }
