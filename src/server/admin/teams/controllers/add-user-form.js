import Joi from 'joi'
import Boom from '@hapi/boom'
import { filter, uniqBy } from 'lodash'

import { buildOptions } from '~/src/common/helpers/build-options'
import { fetchAdminTeam } from '~/src/server/admin/teams/helpers/fetch-admin-team'
import { searchCdpUsers } from '~/src/server/admin/teams/helpers/search-cdp-users'
import { presentUsersToAdd } from '~/src/server/admin/teams/helpers/prerequisites/present-users-to-add'
import { provideCdpTeam } from '~/src/server/admin/teams/helpers/prerequisites/provide-cdp-team'

const addUserFormController = {
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

    const { team } = await fetchAdminTeam(request.params.teamId)
    const cdpUsers = cdpUserQuery ? await searchCdpUsers(cdpUserQuery) : []
    const userIds = usersToAdd.map((user) => user.userId)

    const allUsers = filter(
      uniqBy([...usersToAdd, ...cdpUsers], 'userId'),
      (user) => !team.users.some((teamUser) => teamUser.userId === user.userId)
    )

    return h.view('admin/teams/views/add-user-form', {
      pageTitle: 'Add user',
      heading: 'Add users',
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
          text: 'Add users'
        }
      ]
    })
  }
}

export { addUserFormController }
