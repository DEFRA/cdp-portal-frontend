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
        value:
          `DEFRA/${repository.id}` !== removeUrlParts(repository.url)
            ? removeUrlParts(repository.url)
            : `${repository.id}`,
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
