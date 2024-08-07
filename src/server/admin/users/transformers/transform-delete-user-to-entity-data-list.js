import { remove } from 'lodash'

import { transformUserToEntityDataList } from '~/src/server/admin/users/transformers/transform-user-to-entity-data-list'

const exclusions = ['teams', 'defra aws id', 'defra vpn id']

function transformDeleteUserToEntityDataList(user) {
  return [
    ...remove(
      transformUserToEntityDataList(user),
      ({ heading }) => !exclusions.includes(heading.text.toLowerCase())
    ),
    {
      heading: {
        text: 'Last updated'
      },
      entity: {
        kind: 'date',
        value: user.updatedAt
      }
    }
  ]
}

export { transformDeleteUserToEntityDataList }
