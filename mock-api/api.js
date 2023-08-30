const { deployments } = require('./deployments')
const { users } = require('./users')
const { gitHubUsers } = require('./github-users')
const { teams } = require('./teams')

module.exports = {
  deployments,
  users,
  'github-users': gitHubUsers,
  teams
}
