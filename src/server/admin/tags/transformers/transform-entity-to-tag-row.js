import { serviceTags } from '../helpers/service-tags.js'

export function transformEntityToRow(entity, tag) {
  const teams = entity?.teams
    ?.filter((team) => team.teamId)
    ?.map((team) => ({
      kind: 'link',
      value: team.name,
      url: `/teams/${team.teamId}`
    }))

  const tags = entity.tags
    .map((tagName) => serviceTags[tagName])
    .filter(Boolean)

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
          value: tags.map((tagDetail) => ({
            kind: 'tag',
            value: tagDetail.displayName,
            classes: tagDetail.className
          }))
        }
      },
      {
        headers: 'team',
        entity: { kind: 'list', value: teams }
      },
      {
        entity: {
          classes: 'app-button--small app-button--destructive',
          kind: 'button',
          url: `/admin/tags/${tag.name}/remove/${entity.name}`,
          value: 'Remove'
        },
        headers: 'actions'
      }
    ]
  }
}
