import Joi from 'joi'
import Boom from '@hapi/boom'
import { filter, uniqBy } from 'lodash'

import { buildOptions } from '~/src/server/common/helpers/options/build-options'
import {
  fetchCdpTeam,
  searchCdpUsers
} from '~/src/server/admin/teams/helpers/fetch'
import { presentUsersToAdd } from '~/src/server/admin/teams/helpers/pre/present-users-to-add'
import { provideCdpTeam } from '~/src/server/admin/teams/helpers/pre/provide-cdp-team'

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
    const title = 'Add team members'

    return h.view('admin/teams/views/add/member-form', {
      pageTitle: title,
      heading: title,
      headingCaption: 'Search for Core Delivery Platform user.',
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
          text: team.name + ' team',
          href: '/admin/teams/' + team.teamId
        },
        {
          text: title
        }
      ]
    })
  }
}

export { addMemberFormController }
