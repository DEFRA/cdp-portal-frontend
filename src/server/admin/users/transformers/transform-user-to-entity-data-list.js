import { startCase } from 'lodash'

import { appConfig } from '~/src/config'

function transformUserToEntityDataList(user) {
  return [
    {
      heading: 'Name',
      entity: {
        kind: 'link',
        value: startCase(user.name),
        url: `${appConfig.get('appPathPrefix')}/admin/users/${user.userId}`
      }
    },
    {
      heading: 'Email',
      entity: {
        kind: 'link',
        value: `mailto:${user.email}`,
        url: user.email
      }
    }
  ]
}

export { transformUserToEntityDataList }
