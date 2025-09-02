import Joi from 'joi'
import Boom from '@hapi/boom'
import uniqBy from 'lodash/uniqBy.js'
import filter from 'lodash/filter.js'
import { escapeRegex } from '@hapi/hoek'

import { formatText } from '../../../../../config/nunjucks/filters/filters.js'
import { buildOptions } from '../../../../common/helpers/options/build-options.js'
import { provideSelectedEntities } from '../../helpers/pre/provide-selected-entities.js'
import {
  searchCdpUsers,
  searchCdpTeams,
  fetchPermissionsScope
} from '../../helpers/fetchers.js'
import { renderTag } from '../../../../common/helpers/view/render-tag.js'

async function buildEntitiesOptions(searchQuery, scope, selectedEntities) {
  const kind = scope.kind
  const foundEntities = []

  if (searchQuery) {
    const escapedSearchQuery = escapeRegex(searchQuery)
    await Promise.all(
      kind.map(async (k) => {
        if (k === 'user') {
          const users = await searchCdpUsers(escapedSearchQuery)
          if (users?.length) {
            foundEntities.push(
              ...users.map((user) => ({
                name: user.name,
                id: user.userId,
                kind: 'user'
              }))
            )
          }
        }

        if (k === 'team') {
          const teams = await searchCdpTeams(escapedSearchQuery)
          if (teams?.length) {
            foundEntities.push(
              ...teams.map((team) => ({
                name: team.name,
                id: team.teamId,
                kind: 'team'
              }))
            )
          }
        }
      })
    )
  }

  const scopeTeams = scope.teams.map((team) => ({ id: team.teamId })) || []
  const scopeUsers = scope.users.map((user) => ({ id: user.userId })) || []
  const existingScopeEntities = [...scopeUsers, ...scopeTeams]

  // Unique selected entities and search result entities. Don't show entities that already have the scope
  const entities = filter(
    uniqBy([...selectedEntities, ...foundEntities], 'id'),
    (entity) =>
      !existingScopeEntities?.some(
        (existingEntity) => existingEntity.id === entity.id
      )
  ).sort((a, b) => a.name.localeCompare(b.name))

  const renderOptionHtml = (entity) => {
    if (entity.kind === 'user') {
      return (
        renderTag({ text: 'user', classes: ['govuk-tag--green'] }) + entity.name
      )
    }

    return (
      renderTag({ text: 'team', classes: ['govuk-tag--blue'] }) + entity.name
    )
  }

  return entities?.length
    ? buildOptions(
        entities.map((entity) => ({
          html: scope.kind.length > 1 ? renderOptionHtml(entity) : entity.name,
          value: `${entity.kind}:${entity.id}`
        })),
        false
      )
    : null
}

function generateUiMessages(kind) {
  switch (true) {
    case kind.includes('user') && kind.includes('team'):
      return {
        search: {
          label: 'Search for a User or Team',
          hint: 'A user by their name or email and a team by its name',
          noResults: 'No users or teams found'
        }
      }
    case kind.includes('user') && !kind.includes('team'):
      return {
        search: {
          label: 'Search for a User',
          hint: 'By their name or email',
          noResults: 'No users found'
        }
      }
    case kind.includes('team') && !kind.includes('user'):
      return {
        search: {
          label: 'Search for a Team',
          hint: "By it's name",
          noResults: 'No teams found'
        }
      }
  }
}

const addPermissionFormController = {
  options: {
    id: 'admin/permissions/{scopeId}/add',
    validate: {
      query: Joi.object({
        searchQuery: Joi.string().allow(''),
        entityIds: Joi.array().items(Joi.string().allow('')).single().allow('')
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    },
    pre: [provideSelectedEntities]
  },
  handler: async (request, h) => {
    const searchQuery = request?.query?.searchQuery
    const selectedEntities = request.pre.selectedEntities
    const selectedEntityIds = selectedEntities.map(
      (entity) => `${entity.kind}:${entity.id}`
    )
    const scope = await fetchPermissionsScope(request, request.params.scopeId)

    return h.view('admin/permissions/views/add/add-permission-form', {
      pageTitle: 'Add Permission',
      uiMessages: generateUiMessages(scope.kind),
      formValues: {
        searchQuery,
        entityIds: selectedEntityIds
      },
      entities: await buildEntitiesOptions(
        searchQuery,
        scope,
        selectedEntities
      ),
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

export { addPermissionFormController }
