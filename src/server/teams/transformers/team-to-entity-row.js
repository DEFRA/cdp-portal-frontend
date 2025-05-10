import { config } from '~/src/config/config.js'
import {
  renderComponent,
  renderIcon
} from '~/src/server/common/helpers/nunjucks/render-component.js'

function teamToEntityRow(team) {
  const githubOrg = config.get('githubOrg')

  const icon = team.isMemberOfTeam
    ? renderComponent(
        'tool-tip',
        {
          text: 'My Team',
          classes: 'app-tool-tip--small'
        },
        [renderIcon('star-icon', { classes: 'app-icon--minuscule' })]
      )
    : ''

  return {
    cells: [
      {
        headers: 'member',
        isCentered: true,
        classes: 'app-entity-table__cell--owned',
        entity: { kind: 'html', value: icon }
      },
      {
        headers: 'name',
        entity: {
          kind: 'link',
          value: team.name,
          url: `/teams/${team.teamId}`
        }
      },
      {
        headers: 'github-team',
        entity: {
          kind: 'link',
          value: team?.github ? `@${team.github}` : null,
          url: team?.github
            ? `https://github.com/orgs/${githubOrg}/teams/${team.github}`
            : null,
          newWindow: true
        }
      },
      {
        headers: 'members',
        entity: {
          kind: 'text',
          value: team.users?.length
        }
      },
      {
        headers: 'updated',
        entity: {
          kind: 'date',
          value: team.updatedAt
        }
      },
      {
        headers: 'created',
        entity: {
          kind: 'date',
          value: team.createdAt
        }
      }
    ]
  }
}

export { teamToEntityRow }
