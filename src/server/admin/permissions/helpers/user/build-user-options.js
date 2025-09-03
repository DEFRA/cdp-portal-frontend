import filter from 'lodash/filter.js'
import uniqBy from 'lodash/uniqBy.js'
import { escapeRegex } from '@hapi/hoek'

import { searchCdpUsers } from '../fetchers.js'
import { buildOptions } from '../../../../common/helpers/options/build-options.js'

async function buildUsersOptions(searchQuery, scope, selectedUser) {
  const kind = scope.kind
  const foundUsers = []

  if (searchQuery) {
    const escapedSearchQuery = escapeRegex(searchQuery)
    const searchPromises = kind
      .map((k) => {
        if (k === 'member') {
          return searchCdpUsers(escapedSearchQuery)
        }
        return null
      })
      .filter(Boolean)

    const searchResponse = await Promise.all(searchPromises)

    for (const response of searchResponse) {
      if (response?.length) {
        foundUsers.push(
          ...response.map((user) => ({
            name: user.name,
            id: user.userId,
            kind: 'member'
          }))
        )
      }
    }
  }

  const currentSelection = selectedUser
    ? {
        name: selectedUser.name,
        id: selectedUser.userId,
        kind: 'user'
      }
    : null
  const matches = [currentSelection, ...foundUsers].filter(Boolean)

  // Unique selected users and search results. Don't show users that already have the scope
  const users = filter(uniqBy(matches, 'id'))
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name))

  return users?.length
    ? buildOptions(
        users.map((entity) => ({
          text: entity.name,
          value: entity.id
        })),
        false
      )
    : null
}

export { buildUsersOptions }
