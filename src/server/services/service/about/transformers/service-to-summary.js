import { config } from '~/src/config/config.js'
import { noValue } from '~/src/server/common/constants/no-value.js'
import { buildLink } from '~/src/server/common/helpers/view/build-link.js'
import { renderComponent } from '~/src/server/common/helpers/nunjucks/render-component.js'
import { buildList } from '~/src/server/common/helpers/view/build-list.js'

function transformServiceToSummary(repository, entity) {
  const dockerHubUrl = config.get('dockerHubUrl')
  const dockerHubServicePage = `${dockerHubUrl}/${entity?.name}/tags`

  const githubUrl = repository?.url ?? `https://github.com/DEFRA/${entity.name}`

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
    renderComponent('tag', {
      text: topic,
      url: `https://github.com/search?q=topic%3Acdp+org%3ADEFRA+topic%3A${topic}&type=repositories`,
      newWindow: true,
      link: { classes: 'app-link--without-underline' },
      attributes: { 'data-testid': 'govuk-tag' }
    }).trim()
  )

  return {
    classes: 'app-summary-list govuk-!-margin-bottom-0',
    attributes: { 'data-testid': 'service-summary' },
    rows: [
      {
        key: { text: 'Kind' },
        value: {
          html: renderComponent('tag', {
            text: entity.subType ?? noValue,
            classes: 'govuk-tag--blue'
          })
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
          html: buildLink({ href: githubUrl })
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
          html: buildLink({ href: dockerHubServicePage })
        }
      },
      {
        key: { text: 'Created' },
        value: {
          html: renderComponent('time', { datetime: entity.created })
        }
      }
    ]
  }
}

export { transformServiceToSummary }
