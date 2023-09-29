import { startCase } from 'lodash'

import { config } from '~/src/config'

function transformRepositoryToEntityDataList(repository) {
  const team = repository?.teams?.at(0)
  return [
    {
      heading: 'Team',
      entity: {
        kind: 'link',
        value: team && startCase(team),
        url: `${config.get('appPathPrefix')}/teams/${team}`
      }
    },
    {
      heading: 'Type',
      entity: {
        kind: 'text',
        value: repository.primaryLanguage
      }
    },
    {
      heading: 'GitHub Repository',
      html:
        repository.url &&
        `<a class="app-link" href="${
          repository.url
        }" target="_blank">${repository.url.split('/').slice(3).join('/')}</a>`
    },
    {
      heading: 'Repository created',
      entity: { kind: 'date', value: repository.createdAt }
    }
  ]
}

export { transformRepositoryToEntityDataList }
