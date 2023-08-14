import { startCase } from 'lodash'

import { appConfig } from '~/src/config'

function transformTeamToEntityDataList(team) {
  return [
    {
      heading: 'Name',
      entity: {
        kind: 'link',
        value: startCase(team.name),
        url: `${appConfig.get('appPathPrefix')}/admin/teams/${team.aadGroupId}`
      }
    }
  ]
}

export { transformTeamToEntityDataList }
