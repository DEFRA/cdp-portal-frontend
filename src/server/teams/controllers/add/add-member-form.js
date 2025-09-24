import Joi from 'joi'
import Boom from '@hapi/boom'
import uniqBy from 'lodash/uniqBy.js'
import filter from 'lodash/filter.js'
import { teamIdValidation, scopes } from '@defra/cdp-validation-kit'

import { buildOptions } from '../../../common/helpers/options/build-options.js'
import { presentUsersToAdd } from '../../../admin/teams/helpers/pre/present-users-to-add.js'
import { provideCdpTeam } from '../../../admin/teams/helpers/pre/provide-cdp-team.js'
import {
  fetchCdpTeam,
  searchCdpUsers
} from '../../../admin/teams/helpers/fetch/fetchers.js'

const addMemberFormController = {
  options: {
    id: 'teams/{teamId}/add-member',
    auth: {
      mode: 'required',
      access: {
        scope: [scopes.admin, 'team:{params.teamId}']
      }
    },
    validate: {
      params: Joi.object({
        teamId: teamIdValidation
      }),
      query: Joi.object({
        userIds: Joi.array().items(Joi.string().allow('')).single().allow(''),
        cdpUserQuery: Joi.string().allow('')
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    },
    pre: [provideCdpTeam, presentUsersToAdd]
  },
  handler: async (request, h) => {
    const usersToAdd = request.pre?.usersToAdd

    const query = request?.query
    const cdpUserQuery = query?.cdpUserQuery || null

    const team = await fetchCdpTeam(request.params.teamId)

    const searchCdpUsersResponse = cdpUserQuery
      ? await searchCdpUsers(cdpUserQuery)
      : null
    const cdpUsers = searchCdpUsersResponse ?? []

    const userIds = usersToAdd.map((user) => user.userId)

    const allUsers = filter(
      uniqBy([...usersToAdd, ...cdpUsers], 'userId'),
      (user) => !team.users.some((teamUser) => teamUser.userId === user.userId)
    ).sort((a, b) => a.name.localeCompare(b.name))

    return h.view('teams/views/add/member-form', {
      pageTitle: 'Add Team Member',
      formValues: {
        cdpUserQuery,
        userIds
      },
      cdpUsers: allUsers?.length
        ? buildOptions(
            allUsers.map((cdpUser) => ({
              text: `${cdpUser.name} - ${cdpUser.email}`,
              value: cdpUser.userId
            })),
            false
          )
        : null,
      team,
      usersToAdd: usersToAdd.map((user) => `${user.name} - ${user.email}`),
      breadcrumbs: [
        {
          text: 'Teams',
          href: '/teams'
        },
        {
          text: team.name,
          href: '/teams/' + team.teamId
        },
        {
          text: 'Add'
        }
      ]
    })
  }
}

export { addMemberFormController }
