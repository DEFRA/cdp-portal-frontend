import { kindOptions } from './build-kind-options.js'

describe('#kindOptions', () => {
  test('Should have three options: User, Team, Team member', () => {
    expect(kindOptions).toHaveLength(3)
    expect(kindOptions.at(0)).toEqual({
      text: 'User',
      value: 'user',
      label: { classes: 'app-label app-label--small' },
      hint: { text: 'An individual user' }
    })
    expect(kindOptions.at(1)).toEqual({
      text: 'Team',
      value: 'team',
      label: { classes: 'app-label app-label--small' },
      hint: { text: 'All members of a team' }
    })
    expect(kindOptions.at(2)).toEqual({
      text: 'Member',
      value: 'member',
      label: { classes: 'app-label app-label--small' },
      hint: { text: 'A member is a user scoped to a team' }
    })
  })
})
