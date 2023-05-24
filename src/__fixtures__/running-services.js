const runningServicesFixture = {
  'cdp-portal-frontend': {
    development: '0.2.0',
    dockerImage:
      '333333333.dkr.ecr.us-west-2.amazonaws.com/cdp-portal-frontend:0.2.0',
    preProduction: '0.2.0',
    production: '0.2.0',
    sandbox: '0.2.0',
    testing: '0.2.0'
  },
  'cdp-teams-and-repositories': {
    development: '0.2.0',
    dockerImage:
      '222222222.dkr.ecr.us-west-2.amazonaws.com/cdp-teams-and-repositories:0.2.0',
    preProduction: '0.2.0',
    production: '0.2.0',
    sandbox: '0.2.0',
    testing: '0.2.0'
  }
}

export { runningServicesFixture }
