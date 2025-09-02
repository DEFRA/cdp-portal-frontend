import Joi from 'joi'
import Boom from '@hapi/boom'
import uniqBy from 'lodash/uniqBy.js'
import filter from 'lodash/filter.js'

import { buildOptions } from '../../../../common/helpers/options/build-options.js'
import { fetchCdpTeam, searchCdpUsers } from '../../helpers/fetch/index.js'
import { presentUsersToAdd } from '../../helpers/pre/present-users-to-add.js'
import { provideCdpTeam } from '../../helpers/pre/provide-cdp-team.js'

const addMemberFormController = {
  options: {
    id: 'admin/teams/{teamId}/add-member',
    validate: {
      params: Joi.object({
        teamId: Joi.string().required()
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

    return h.view('admin/teams/views/add/member-form', {
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
          text: 'Admin',
          href: '/admin'
        },
        {
          text: 'Teams',
          href: '/admin/teams'
        },
        {
          text: team.name,
          href: '/admin/teams/' + team.teamId
        },
        {
          text: 'Add'
        }
      ]
    })
  }
}

export { addMemberFormController }
