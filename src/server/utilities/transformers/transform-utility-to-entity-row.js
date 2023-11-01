import { startCase } from 'lodash'

import { config } from '~/src/config'
import { removeHost } from '~/src/server/common/helpers/remove-host'

function transformUtilityToEntityRow(utilityType) {
  return (utility) => [
    {
      kind: 'link',
      value: utility.id,
      url: `${config.get('appPathPrefix')}/utilities/${utilityType}/${
        utility.id
      }`
    },
    {
      kind: 'link',
      value: utility.teams?.at(0) && startCase(utility.teams.at(0)),
      url: `${config.get('appPathPrefix')}/teams/${utility.teams?.at(0)}`
    },
    {
      kind: 'text',
      value: utility.primaryLanguage
    },
    {
      kind: 'link',
      value: removeHost(utility.url),
      url: utility.url,
      newWindow: true
    },
    {
      kind: 'date',
      value: utility.createdAt
    }
  ]
}

export { transformUtilityToEntityRow }
