const { deployedServices } = require('./deployed-services')
const { services } = require('./services')
const { runningServices } = require('./running-services')

module.exports = {
  'deployed-services': deployedServices,
  services,
  'running-services': runningServices
}
