import Joi from 'joi'
import Boom from '@hapi/boom'
import uniqBy from 'lodash/uniqBy.js'
import filter from 'lodash/filter.js'
import { escapeRegex } from '@hapi/hoek'

import { buildOptions } from '../../../../common/helpers/options/build-options.js'
import { provideSelectedUser } from '../../helpers/pre/provide-selected-user.js'
import {
  searchCdpUsers,
  fetchPermissionsScope
} from '../../helpers/fetchers.js'

async function buildEntitiesOptions(searchQuery, scope, selectedUser) {
  const kind = scope.kind
  const foundEntities = []

  if (searchQuery) {
    const escapedSearchQuery = escapeRegex(searchQuery)
    const searchPromises = kind
      .map(() => searchCdpUsers(escapedSearchQuery))
      .filter(Boolean)

    const searchResponse = await Promise.all(searchPromises)

    for (const response of searchResponse) {
      if (response?.users?.length) {
        foundEntities.push(
          ...response.users.map((user) => ({
            name: user.name,
            id: user.userId,
            kind: 'user'
          }))
        )
      }
    }
  }

  const scopeUsers = scope.users.map((user) => ({ id: user.userId })) || []
  const existingScopeEntities = scopeUsers
  const currentSelection = selectedUser
    ? {
        name: selectedUser.name,
        id: selectedUser.userId,
        kind: 'user'
      }
    : null
  const matches = [currentSelection, ...foundEntities].filter(Boolean)

  // Unique selected entities and search result entities. Don't show entities that already have the scope
  const entities = filter(
    uniqBy(matches, 'id'),
    (entity) =>
      !existingScopeEntities?.some(
        (existingEntity) => existingEntity.id === entity.id
      )
  )
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name))

  return entities?.length
    ? buildOptions(
        entities.map((entity) => ({
          text: entity.name,
          value: entity.id
        })),
        false
      )
    : null
}

const addUserPermissionFormController = {
  options: {
    id: 'admin/permissions/user/{scopeId}/add',
    validate: {
      query: Joi.object({
        searchQuery: Joi.string().allow(''),
        entityId: Joi.string().allow('')
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    },
    pre: [provideSelectedUser]
  },
  handler: async (request, h) => {
    const searchQuery = request?.query?.searchQuery
    const selectedUser = request.pre.selectedUser

    const { scope } = await fetchPermissionsScope(
      request,
      request.params.scopeId
    )

    return h.view('admin/permissions/views/add/add-user-permission-form', {
      pageTitle: 'Add Permission',
      uiMessages: {
        search: {
          label: 'Search for a User',
          hint: 'By their name or email',
          noResults: 'No users found'
        }
      },
      formValues: {
        searchQuery,
        entityId: selectedUser?.userId
      },
      entities: await buildEntitiesOptions(searchQuery, scope, selectedUser),
      scope,
      splitPaneBreadcrumbs: [
        {
          text: 'Admin',
          href: '/admin'
        },
        {
          text: 'Permissions',
          href: '/admin/permissions'
        },
        {
          text: scope.value,
          href: '/admin/permissions/' + scope.scopeId
        },
        {
          text: 'User'
        }
      ]
    })
  }
}

export { addUserPermissionFormController }
