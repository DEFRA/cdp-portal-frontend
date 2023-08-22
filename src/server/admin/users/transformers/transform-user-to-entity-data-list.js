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
        value: user.email,
        url: `mailto:${user.email}`
      }
    },
    {
      heading: 'GitHub',
      entity: {
        kind: 'link',
        value: user.github ? `@${user.github}` : null,
        url: `https://github.com/orgs/defra-cdp-sandpit/people/${user.github}`,
        newWindow: true
      }
    },
    {
      heading: 'Defra AWS ID',
      entity: {
        kind: 'text',
        value: user.defraAwsId
      }
    },
    {
      heading: 'Defra VPN ID',
      entity: {
        kind: 'text',
        value: user.defraVpnId
      }
    }
  ]
}

export { transformUserToEntityDataList }
