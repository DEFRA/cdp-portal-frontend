import { tagToEntity } from '~/src/server/admin/tags/helpers/tag-to-entity.js'

export function transformEntityToTagRow(entity, withActions = true) {
  const teams = entity?.teams
    ?.filter((team) => team.teamId)
    ?.map((team) => ({
      kind: 'link',
      value: team.name,
      url: `/teams/${team.teamId}`
    }))

  return {
    cells: [
      {
        headers: 'service',
        entity: {
          kind: 'link',
          value: entity.name,
          url: `/services/${entity.name}`
        }
      },
      {
        headers: 'team',
        entity: { kind: 'list', value: teams }
      },
      {
        headers: 'tags',
        entity: { kind: 'group', value: entity.tags.map(tagToEntity) }
      }
    ]
  }
}
