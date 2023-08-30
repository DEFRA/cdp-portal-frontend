import { startCase } from 'lodash'

import { appConfig } from '~/src/config'

function transformUserToEntityRow(user) {
  const gitHubOrg = appConfig.get('gitHubOrg')

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
      url: `https://github.com/orgs/${gitHubOrg}/people/${user.github}`,
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
