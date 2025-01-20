import { config } from '~/src/config/config.js'

function transformTeamToEntityRow(team) {
  const githubOrg = config.get('githubOrg')

  return {
    cells: [
      {
        headers: 'name',
        entity: {
          kind: 'link',
          value: team.name,
          url: `/admin/teams/${team.teamId}`
        }
      },
      {
        headers: 'description',
        entity: {
          kind: 'text',
          value: team.description
        }
      },
      {
        headers: 'github-team',
        entity: {
          kind: 'link',
          value: team.github ? `@${team.github}` : null,
          url: `https://github.com/orgs/${githubOrg}/teams/${team.github}`,
          newWindow: true
        }
      },
      {
        headers: 'service-codes',
        entity: {
          kind: 'text',
          value: team.serviceCodes
        }
      },
      {
        headers: 'alert-emails',
        entity: {
          kind: 'html',
          value: team.alertEmailAddresses?.join('<br>')
        }
      },
      {
        headers: 'members',
        entity: {
          kind: 'text',
          value: team.users.length
        }
      },
      {
        headers: 'last-updated',
        entity: { kind: 'date', value: team.updatedAt }
      },
      {
        headers: 'created',
        entity: { kind: 'date', value: team.createdAt }
      }
    ]
  }
}

export { transformTeamToEntityRow }
