import { removeUrlParts } from '~/src/server/common/helpers/remove-url-parts'

function repositoryToEntityDataList(repository) {
  return [
    {
      heading: { text: `Team${repository?.teams.length > 1 ? 's' : ''}` },
      entity: {
        kind: 'list',
        value: repository?.teams?.map((team) => ({
          kind: 'link',
          value: team.name,
          url: `/teams/${team.teamId}`
        }))
      }
    },
    {
      heading: {
        text: 'Language'
      },
      entity: {
        kind: 'text',
        value: repository.primaryLanguage
      }
    },
    {
      heading: {
        text: 'GitHub Repository'
      },
      entity: {
        kind: 'link',
        value: removeUrlParts(repository.url),
        url: repository.url,
        newWindow: true
      }
    },
    {
      heading: {
        text: 'Repository created'
      },
      entity: { kind: 'date', value: repository.createdAt }
    }
  ]
}

export { repositoryToEntityDataList }
