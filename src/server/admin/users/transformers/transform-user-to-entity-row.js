import { config } from '~/src/config/config.js'

function transformUserToEntityRow(user) {
  const githubOrg = config.get('githubOrg')

  return [
    {
      kind: 'link',
      value: user.name ? user.name : null,
      url: `/admin/users/${user.userId}`
    },
    {
      kind: 'link',
      value: user.email,
      url: `mailto:${user.email}`
    },
    {
      kind: 'link',
      value: user.github ? `@${user.github}` : null,
      url: `https://github.com/orgs/${githubOrg}/people/${user.github}`,
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
