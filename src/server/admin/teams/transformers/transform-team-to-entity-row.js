import { startCase } from 'lodash'

import { appConfig } from '~/src/config'

function transformTeamToEntityRow(team) {
  return [
    {
      kind: 'link',
      value: startCase(team.name),
      url: `${appConfig.get('appPathPrefix')}/admin/teams/${team.aadGroupId}`
    }
  ]
}

export { transformTeamToEntityRow }
