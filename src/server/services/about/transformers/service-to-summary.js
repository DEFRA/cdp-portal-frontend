import { config } from '~/src/config/config.js'
import { noValue } from '~/src/server/common/constants/no-value.js'
import { buildLink } from '~/src/server/common/helpers/view/build-link.js'
import { renderComponent } from '~/src/server/common/helpers/nunjucks/render-component.js'
import { buildList } from '~/src/server/common/helpers/view/build-list.js'

const getKind = (service) => {
  switch (true) {
    case service.isFrontend:
      return 'Frontend'
    case service.isBackend:
      return 'Backend'
    default:
      return noValue
  }
}

function transformServiceToSummary(service) {
  const dockerHubUrl = config.get('dockerHubUrl')
  const dockerHubServicePage = `${dockerHubUrl}/${service?.imageName}/tags`

  const teams = service?.teams
    ?.filter((team) => team.teamId)
    ?.map((team) => buildLink(`/teams/${team.teamId}`, team.name, false))

  const topics = service?.topics.map((topic) =>
    renderComponent('tag', {
      text: topic,
      url: `https://github.com/search?q=topic%3Acdp+org%3ADEFRA+topic%3A${topic}&type=repositories`,
      link: { classes: 'app-link--without-underline' },
      attributes: { 'data-testid': 'govuk-tag' }
    }).trim()
  )

  return {
    classes: 'app-summary-list govuk-!-margin-bottom-8',
    rows: [
      {
        key: { text: 'Kind' },
        value: {
          html: renderComponent('tag', {
            text: getKind(service),
            classes: 'app-tag--blue'
          })
        }
      },
      {
        key: { text: 'GitHub Repository' },
        value: {
          html: buildLink(service.githubUrl, service.githubUrl)
        }
      },
      {
        key: { text: `Team${teams?.length > 1 ? 's' : ''}` },
        value: {
          html: teams?.length ? buildList(teams) : noValue
        }
      },
      {
        key: { text: 'Language' },
        value: { text: service.primaryLanguage ?? noValue }
      },
      {
        key: { text: 'Docker Hub' },
        value: {
          html: buildLink(dockerHubServicePage)
        }
      },
      {
        key: { text: 'Topics' },
        value: {
          html: topics.length ? topics.join(' ') : noValue
        }
      },
      {
        key: { text: 'Created' },
        value: {
          html: renderComponent('time', { datetime: service.createdAt })
        }
      }
    ]
  }
}

export { transformServiceToSummary }
