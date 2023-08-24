import { startCase } from 'lodash'

import { appConfig } from '~/src/config'

function transformUserToEntityDataList(user) {
  const gitHubOrg = appConfig.get('gitHubOrg')

  return [
    {
      heading: 'Name',
      entity: {
        kind: 'text',
        value: startCase(user.name)
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
        url: `https://github.com/orgs/${gitHubOrg}/people/${user.github}`,
        newWindow: true
      }
    },
    {
      heading: 'Defra Aws Id',
      entity: {
        kind: 'text',
        value: user.defraAwsId
      }
    },
    {
      heading: 'Defra Vpn Id',
      entity: {
        kind: 'text',
        value: user.defraVpnId
      }
    },
    {
      heading: 'Created',
      entity: {
        kind: 'date',
        value: user.createdAt
      }
    }
  ]
}

export { transformUserToEntityDataList }
