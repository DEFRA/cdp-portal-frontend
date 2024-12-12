import Joi from 'joi'
import Boom from '@hapi/boom'
import uniqBy from 'lodash/uniqBy.js'
import filter from 'lodash/filter.js'

import { buildOptions } from '~/src/server/common/helpers/options/build-options.js'
import {
  searchCdpUsers,
  fetchCdpTeam
} from '~/src/server/admin/teams/helpers/fetch/index.js'
import { provideCdpTeam } from '~/src/server/admin/teams/helpers/pre/provide-cdp-team.js'
import { presentUsersToAdd } from '~/src/server/admin/teams/helpers/pre/present-users-to-add.js'

const addMemberFormController = {
  options: {
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

    const { team } = await fetchCdpTeam(request.params.teamId)

    const searchCdpUsersResponse = cdpUserQuery
      ? await searchCdpUsers(cdpUserQuery)
      : null
    const cdpUsers = searchCdpUsersResponse?.users ?? []

    const userIds = usersToAdd.map((user) => user.userId)

    const allUsers = filter(
      uniqBy([...usersToAdd, ...cdpUsers], 'userId'),
      (user) => !team.users.some((teamUser) => teamUser.userId === user.userId)
    )

    return h.view('teams/views/add/member-form', {
      pageTitle: 'Add team members',
      heading: 'Add team members',
      headingCaption: 'Search for CDP - Portal user',
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
          text: team.name + ' team',
          href: '/teams/' + team.teamId
        },
        {
          text: 'Add team members'
        }
      ]
    })
  }
}

export { addMemberFormController }
