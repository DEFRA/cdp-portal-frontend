import {
  renderComponent,
  renderIcon
} from '~/src/server/common/helpers/nunjucks/render-component.js'

function utilityToEntityRow(utilityType, isAuthenticated) {
  return (utility) => {
    const icon = utility.isOwner
      ? renderComponent(
          'tool-tip',
          { text: 'Owned Utility', classes: 'app-tool-tip--small' },
          [renderIcon('star-icon', { classes: 'app-icon--minuscule' })]
        )
      : ''

    return {
      cells: [
        ...(isAuthenticated
          ? [
              {
                headers: 'owner',
                isCentered: true,
                classes: 'app-entity-table__cell--owned',
                entity: { kind: 'html', value: icon }
              }
            ]
          : []),
        {
          headers: 'utility',
          entity: {
            kind: 'link',
            value: utility.id,
            url: `/utilities/${utilityType}/${utility.id}`
          }
        },
        {
          headers: 'team',
          entity: {
            kind: 'group',
            value: utility?.teams?.map((team) => ({
              kind: 'link',
              value: team.name,
              url: `/teams/${team.teamId}`
            }))
          }
        },
        {
          headers: 'language',
          entity: {
            kind: 'text',
            value: utility.primaryLanguage
          }
        },
        {
          headers: 'github-repository',
          entity: {
            kind: 'link',
            value: utility.url,
            url: utility.url,
            newWindow: true
          }
        },
        {
          headers: 'created',
          entity: {
            kind: 'date',
            value: utility.createdAt
          }
        }
      ]
    }
  }
}

export { utilityToEntityRow }
