const { deployedServices } = require('./deployed-services')
const { codeRepositories } = require('./code-repositories')
const { runningServices } = require('./running-services')

module.exports = {
  'deployed-services': deployedServices,
  'code-repositories': codeRepositories,
  'running-services': runningServices
}
