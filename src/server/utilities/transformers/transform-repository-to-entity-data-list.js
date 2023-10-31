import { startCase } from 'lodash'

import { config } from '~/src/config'
import { removeHost } from '~/src/server/common/helpers/remove-host'

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
      heading: 'Github Repository',
      entity: {
        kind: 'link',
        value: removeHost(repository.url),
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

export { transformRepositoryToEntityDataList }
