import { startCase } from 'lodash'

import { appConfig } from '~/src/config'

function transformUserToEntityRow(user) {
  return [
    {
      kind: 'link',
      value: user.name ? startCase(user.name) : null,
      url: `${appConfig.get('appPathPrefix')}/admin/users/${user.userId}`
    },
    {
      kind: 'link',
      value: user.email,
      url: `mailto:${user.email}`
    },
    {
      kind: 'link',
      value: user.github ? `@${user.github}` : null,
      url: `https://github.com/orgs/defra-cdp-sandpit/people/${user.github}`,
      newWindow: true
    },
    {
      kind: 'text',
      value: user.defraAwsId
    },
    {
      kind: 'text',
      value: user.defraVpnId
    }
  ]
}

export { transformUserToEntityRow }
