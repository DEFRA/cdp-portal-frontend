import { removeUrlParts } from '~/src/server/common/helpers/remove-url-parts'

function repositoryToEntityDataList(repository) {
  return [
    {
      heading: `Team${repository?.teams.length > 1 ? 's' : ''}`,
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
      heading: 'Language',
      entity: {
        kind: 'text',
        value: repository.primaryLanguage
      }
    },
    {
      heading: 'GitHub Repository',
      entity: {
        kind: 'link',
        value: removeUrlParts(repository.url),
        url: repository.url,
        newWindow: true
      }
    },
    {
      heading: 'Repository created',
      entity: { kind: 'date', value: repository.createdAt }
    }
  ]
}

export { repositoryToEntityDataList }
