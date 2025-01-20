import { removeUrlParts } from '~/src/server/common/helpers/remove-url-parts.js'
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
          [renderIcon('star-icon', { classes: 'app-icon--tiny' })]
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
          headers: 'service',
          entity: {
            kind: 'link',
            value: utility.id,
            url: `/utilities/${utilityType}/${utility.id}`
          }
        },
        {
          headers: 'service',
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
          headers: 'service',
          entity: {
            kind: 'text',
            value: utility.primaryLanguage
          }
        },
        {
          headers: 'service',
          entity: {
            kind: 'link',
            value: removeUrlParts(utility.url),
            url: utility.url,
            newWindow: true
          }
        },
        {
          headers: 'service',
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
