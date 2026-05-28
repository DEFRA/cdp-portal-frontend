import { config } from '#config/config.js'
import { dateFormatString } from '../../../common/constants/date.js'

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
        headers: 'last-active',
        entity: {
          kind: 'date',
          value: user.lastActive,
          formatString: dateFormatString
        }
      },
      {
        headers: 'last-updated',
        entity: {
          kind: 'date',
          value: user.updatedAt,
          formatString: dateFormatString
        }
      },
      {
        headers: 'created',
        entity: {
          kind: 'date',
          value: user.createdAt,
          formatString: dateFormatString
        }
      }
    ]
  }
}

export { transformUserToEntityRow }
