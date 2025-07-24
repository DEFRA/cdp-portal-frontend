import { config } from '../../../../config/config.js'

function transformUserToEntityRow(user) {
  const githubOrg = config.get('githubOrg')

  return {
    cells: [
      {
        headers: 'name',
        entity: {
          kind: 'link',
          value: user.name ? user.name : null,
          url: `/admin/users/${user.userId}`
        }
      },
      {
        headers: 'email',
        entity: {
          kind: 'link',
          value: user.email,
          url: `mailto:${user.email}`
        }
      },
      {
        headers: 'github-user',
        entity: {
          kind: 'link',
          value: user.github ? `@${user.github}` : null,
          url: `https://github.com/orgs/${githubOrg}/people/${user.github}`,
          newWindow: true
        }
      },
      {
        headers: 'last-updated',
        entity: { kind: 'date', value: user.updatedAt }
      },
      {
        headers: 'created',
        entity: { kind: 'date', value: user.createdAt }
      }
    ]
  }
}

export { transformUserToEntityRow }
