import remove from 'lodash/remove.js'
import { transformTeamToEntityDataList } from '~/src/server/admin/teams/transformers/transform-team-to-entity-data-list.js'

const exclusions = []

function transformDeleteTeamToEntityDataList(team) {
  return [
    {
      heading: {
        text: 'Name'
      },
      entity: {
        kind: 'text',
        value: team.name
      }
    },
    ...remove(
      transformTeamToEntityDataList(team),
      ({ heading }) => !exclusions.includes(heading.text.toLowerCase())
    ),
    {
      heading: {
        text: 'Last updated'
      },
      entity: {
        kind: 'date',
        value: team.updatedAt
      }
    },
    ...(team.users.length
      ? [
          {
            heading: {
              text: 'Members'
            },
            entity: {
              kind: 'list',
              value: team.users.map((user) => ({
                kind: 'link',
                value: user.name,
                url: '/admin/users/' + user.userId
              }))
            }
          }
        ]
      : [])
  ]
}

export { transformDeleteTeamToEntityDataList }
