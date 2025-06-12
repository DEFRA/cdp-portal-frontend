import { transformTagToEntity } from '~/src/server/admin/tags/transformers/transform-tag-to-entity.js'

export function transformEntityToRow(entity, tag) {
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
        headers: 'tags',
        entity: {
          kind: 'group',
          value: entity.tags.map(transformTagToEntity).filter(Boolean)
        }
      },
      {
        headers: 'team',
        entity: { kind: 'list', value: teams }
      },
      {
        entity: {
          classes: 'app-button--small app-button--danger',
          kind: 'button',
          url: `/admin/tags/${tag.name}/remove?service=${entity.name}`,
          value: 'Remove'
        },
        headers: 'actions'
      }
    ]
  }
}
