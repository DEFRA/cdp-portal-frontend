import { startCase } from 'lodash'

import { appConfig } from '~/src/config'

function transformUtilityToEntityRow(utilityType) {
  return (utility) => [
    {
      kind: 'link',
      value: utility.id,
      url: `${appConfig.get('appPathPrefix')}/utilities/${utilityType}/${
        utility.id
      }`
    },
    {
      kind: 'link',
      value: utility.teams?.at(0) && startCase(utility.teams.at(0)),
      url: `${appConfig.get('appPathPrefix')}/teams/${utility.teams?.at(0)}`
    },
    {
      kind: 'text',
      value: utility.primaryLanguage
    },
    {
      kind: 'link',
      value: utility.url.split('/').slice(3).join('/'),
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
