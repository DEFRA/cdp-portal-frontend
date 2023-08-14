import { startCase } from 'lodash'

import { appConfig } from '~/src/config'

function transformUserToEntityRow(user) {
  return [
    {
      kind: 'link',
      value: startCase(user.name),
      url: `${appConfig.get('appPathPrefix')}/admin/users/${user.aadId}`
    },
    {
      kind: 'link',
      value: `mailto:${user.email}`,
      url: user.email
    }
  ]
}

export { transformUserToEntityRow }
