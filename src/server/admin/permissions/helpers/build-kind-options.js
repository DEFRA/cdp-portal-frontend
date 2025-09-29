import { buildOptions } from '../../../common/helpers/options/build-options.js'

const labelClasses = 'app-label app-label--small'
const kindOptions = buildOptions(
  [
    {
      text: 'User',
      value: 'user',
      label: { classes: labelClasses },
      hint: { text: 'An individual user' }
    },
    {
      text: 'Team',
      value: 'team',
      label: { classes: labelClasses },
      hint: {
        text: 'All members of a team'
      }
    },
    {
      text: 'Member',
      value: 'member',
      label: { classes: labelClasses },
      hint: { text: 'A member is a user scoped to a team' }
    }
  ],
  false
)

export { kindOptions }
