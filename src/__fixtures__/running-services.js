const runningServicesFixture = {
  'cdp-portal-frontend': {
    dockerImage:
      '333333333.dkr.ecr.us-west-2.amazonaws.com/cdp-portal-frontend:0.2.0',
    management: '0.1.0',
    infraDev: '0.6.0',
    development: '0.4.0',
    test: '0.3.0',
    perfTest: '0.7.0',
    production: '0.2.0'
  },
  'cdp-teams-and-repositories': {
    dockerImage:
      '222222222.dkr.ecr.us-west-2.amazonaws.com/cdp-teams-and-repositories:0.2.0',
    management: '1.1.0',
    infraDev: '0.4.0',
    development: '0.9.0',
    test: '0.3.1',
    perfTest: '0.8.0',
    production: '2.2.1'
  }
}

export { runningServicesFixture }
