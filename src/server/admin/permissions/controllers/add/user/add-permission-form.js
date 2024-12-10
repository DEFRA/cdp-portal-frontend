import Joi from 'joi'
import Boom from '@hapi/boom'
import uniqBy from 'lodash/uniqBy.js'
import filter from 'lodash/filter.js'

import { formatText } from '~/src/config/nunjucks/filters/index.js'
import { buildOptions } from '~/src/server/common/helpers/options/build-options.js'
import { fetchScope } from '~/src/server/admin/permissions/helpers/fetchers.js'
import { provideSelectedUsers } from '~/src/server/admin/permissions/helpers/pre/provide-selected-users.js'
import { searchCdpUsers } from '~/src/server/admin/teams/helpers/fetch/index.js'

async function buildUsersOptions(query, scope, selectedUsers) {
  const foundUsers = []

  if (query) {
    const searchResponse = await searchCdpUsers(query)

    if (searchResponse?.users?.length) {
      foundUsers.push(...searchResponse.users)
    }
  }

  // Unique selected users and search result users. Don't show users that already have the scope
  const users = filter(
    uniqBy([...selectedUsers, ...foundUsers, ...scope.users], 'userId'),
    (user) =>
      !scope.users?.some((scopeUser) => scopeUser.userId === user.userId)
  )

  return users?.length
    ? buildOptions(
        users.map((cdpUser) => ({ text: cdpUser.name, value: cdpUser.userId })),
        false
      )
    : null
}

const addPermissionToUserFormController = {
  options: {
    id: 'admin/permissions/{scopeId}/user/add',
    validate: {
      query: Joi.object({
        userIds: Joi.array().items(Joi.string().allow('')).single().allow(''),
        cdpUserQuery: Joi.string().allow('')
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    },
    pre: [provideSelectedUsers]
  },
  handler: async (request, h) => {
    const query = request?.query
    const cdpUserQuery = query?.cdpUserQuery || null
    const selectedUsers = request.pre.selectedUsers
    const selectedUsersIds = selectedUsers.map((user) => user.userId)

    const { scope } = await fetchScope(request, request.params.scopeId)

    return h.view('admin/permissions/views/add/user/add-permission-form', {
      pageTitle: 'Add Permission to User',
      formValues: {
        cdpUserQuery,
        userIds: selectedUsersIds
      },
      users: await buildUsersOptions(cdpUserQuery, scope, selectedUsers),
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

export { addPermissionToUserFormController }
