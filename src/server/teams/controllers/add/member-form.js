import Joi from 'joi'
import Boom from '@hapi/boom'
import { filter, uniqBy } from 'lodash'

import { buildOptions } from '~/src/server/common/helpers/build-options'
import {
  fetchCdpTeam,
  searchCdpUsers,
  presentUsersToAdd,
  provideCdpTeam
} from '~/src/server/admin/teams/helpers'

const addMemberFormController = {
  options: {
    validate: {
      params: Joi.object({
        teamId: Joi.string()
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
