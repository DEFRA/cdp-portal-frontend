import { config } from '~/src/config'
import { removeUrlParts } from '~/src/server/common/helpers/remove-url-parts'

function serviceToEntityDataList(service) {
  const dockerHubUrl = config.get('dockerHubUrl')
  const dockerHubServicePage = `${dockerHubUrl}/${service?.imageName}/tags`
  const teams = service?.teams
    ?.filter((team) => team.teamId)
    ?.map((team) => ({
      kind: 'link',
      value: team.name,
      url: `/teams/${team.teamId}`
    }))

  return [
    {
      heading: {
        text: 'GitHub Repository'
      },
      entity: {
        kind: 'link',
        value: removeUrlParts(service.githubUrl),
        url: service.githubUrl,
        newWindow: true
      }
    },
    {
      heading: { text: `Team${teams?.length > 1 ? 's' : ''}` },
      entity: {
        kind: 'group',
        value: teams?.length ? teams : null
      }
    },
    ...(service?.primaryLanguage
      ? [
          {
            heading: {
              text: 'Language'
            },
            entity: {
              kind: 'text',
              value: service.primaryLanguage
            }
          }
        ]
      : []),
    ...(service?.imageName
      ? [
          {
            heading: {
              text: 'Docker Hub'
            },
            entity: {
              kind: 'link',
              value: removeUrlParts(dockerHubServicePage, 4),
              url: dockerHubServicePage,
              newWindow: true
            }
          }
        ]
      : []),
    ...(service?.topics?.length
      ? [
          {
            heading: {
              text: 'Topics',
              classes: 'govuk-!-margin-bottom-1'
            },
            entity: {
              kind: 'group',
              value: service?.topics?.map((topic) => ({
                kind: 'tag',
                value: topic,
                url: `https://github.com/search?q=topic%3Acdp+org%3ADEFRA+topic%3A${topic}&type=repositories`,
                newWindow: true,
                link: {
                  classes: 'app-link-without-underline'
                }
              }))
            }
          }
        ]
      : []),
    {
      heading: {
        text: 'Repository Created'
      },
      entity: { kind: 'date', value: service.createdAt }
    }
  ]
}

export { serviceToEntityDataList }
