import { renderTag } from '../../../common/helpers/view/render-tag.js'
import { renderComponent } from '../../../common/helpers/nunjucks/render-component.js'

const userTagComponent = renderComponent(
  'tool-tip',
  {
    text: 'A user permission is a permission that is applied to an individual user'
  },
  [
    renderTag({
      text: 'User',
      classes: ['govuk-tag--green govuk-!-margin-bottom-1']
    })
  ]
)
const teamTagComponent = renderComponent(
  'tool-tip',
  {
    text: 'A team permission is a permission that is applied to all members in a team'
  },
  [
    renderTag({
      text: 'Team',
      classes: ['govuk-tag--blue govuk-!-margin-bottom-1']
    })
  ]
)
const memberTagComponent = renderComponent(
  'tool-tip',
  {
    text: 'A member permission is a permission that is applied to a user for a specific team'
  },
  [
    renderTag({
      text: 'Member',
      classes: ['app-tag--purple']
    })
  ]
)

export { userTagComponent, teamTagComponent, memberTagComponent }
