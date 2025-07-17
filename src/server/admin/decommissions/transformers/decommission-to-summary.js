import { config } from '~/src/config/config.js'
import { noValue } from '~/src/server/common/constants/no-value.js'
import { formatText } from '~/src/config/nunjucks/filters/filters.js'
import { buildLink } from '~/src/server/common/helpers/view/build-link.js'
import { buildList } from '~/src/server/common/helpers/view/build-list.js'
import { renderTag } from '~/src/server/common/helpers/view/render-tag.js'
import { renderComponent } from '~/src/server/common/helpers/nunjucks/render-component.js'
import { serviceTags } from '~/src/server/admin/tags/helpers/service-tags.js'
import { creationStatuses } from '~/src/server/common/constants/creation-statuses.js'

function transformDecommissionToSummary(repository, entity) {
  const dockerHubUrl = config.get('dockerHubUrl')

  const teams = entity?.teams
    ?.filter((team) => team.teamId)
    ?.map((team) =>
      buildLink({
        href: `/teams/${team.teamId}`,
        text: team.name,
        newTab: false
      })
    )

  const topics = repository?.topics?.map((topic) =>
    renderTag({
      text: topic,
      url: `https://github.com/search?q=topic%3Acdp+org%3ADEFRA+topic%3A${topic}&type=repositories`,
      newWindow: true,
      link: { classes: 'app-link--without-underline' },
      attributes: { 'data-testid': 'govuk-tag' }
    })
  )

  const tags = entity.tags
    ?.map((tagName) => serviceTags[tagName])
    .filter(Boolean)

  const statusTag = renderTag({
    text: formatText(entity.status),
    classes: [entity.statusClass],
    isLoading: entity.status !== creationStatuses.decommissioned
  })

  return {
    classes: 'app-summary-list',
    attributes: { 'data-testid': 'decommission-summary' },
    rows: [
      {
        key: { text: 'Status' },
        value: {
          html: statusTag
        }
      },
      {
        key: { text: 'Started' },
        value: {
          html: entity.decommissioned?.started
            ? renderComponent('time', {
                datetime: entity.decommissioned.started
              })
            : noValue
        }
      },
      {
        key: { text: 'By' },
        value: {
          text: entity.decommissioned?.decommissionedBy?.displayName ?? noValue
        }
      },
      {
        key: { text: 'Type' },
        value: {
          html: `<strong class="govuk-!-margin-right-1">${entity.type}</strong> ${entity.subType}`
        }
      },
      {
        key: { text: 'Tags' },
        value: {
          html: tags.length
            ? tags
                ?.map((tag) => renderTag(tag.displayName, [tag.className]))
                .join(' ')
            : noValue
        }
      },
      {
        key: { text: 'Image name' },
        value: {
          text: entity.name ?? noValue
        }
      },
      {
        key: { text: 'GitHub Repository' },
        value: {
          html: buildLink({
            href: repository?.url ?? `https://github.com/DEFRA/${entity.name}`
          })
        }
      },
      {
        key: { text: `Team${teams?.length > 1 ? 's' : ''}` },
        value: {
          html: teams?.length ? buildList(teams) : noValue
        }
      },
      {
        key: { text: 'Primary Language' },
        value: { text: repository?.primaryLanguage ?? noValue }
      },
      {
        key: { text: 'Topics' },
        value: {
          html: topics?.length ? topics.join(' ') : noValue
        }
      },
      {
        key: { text: 'Docker Hub' },
        value: {
          html: buildLink({ href: `${dockerHubUrl}/${entity?.name}/tags` })
        }
      }
    ]
  }
}

export { transformDecommissionToSummary }
