import { remove } from 'lodash'
import { transformTeamToEntityDataList } from '~/src/server/admin/teams/transformers/transform-team-to-entity-data-list'

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
