const runningServices = [
  {
    runningId: '24be9663-e19b-4dd1-b606-8fa1a5094ba5',
    serviceName: 'FFC Grants Cattle Housing Web',
    environments: {
      production: {
        version: '0.32.0'
      },
      perfTest: {
        version: '0.27.1'
      },
      development: {
        version: '0.28.0'
      },
      test: {
        version: '0.28.0'
      }
    }
  },
  {
    runningId: '24be9663-e19b-4dd1-b606-8fa1a5094ba6',
    serviceName: 'Water Abstraction System',
    environments: {
      development: {
        deploymentId: '14be9663-e19b-4dd1-b606-8fa1a5094ba6',
        version: '0.1.0'
      }
    }
  },
  {
    runningId: '24be9663-e19b-4dd1-b606-8fa1a5094ba0',
    serviceName: 'Waste Exemptions Back Office',
    environments: {
      production: {
        version: '3.6.0'
      },
      perfTest: {
        version: '3.8.0'
      },
      development: {
        version: '3.7.1'
      },
      test: {
        version: '2.4.2'
      }
    }
  },
  {
    runningId: '24be9663-e19b-4dd1-b606-8fa1a5094ba8',
    serviceName: 'Rod Licensing',
    environments: {
      development: {
        version: '0.7.0'
      },
      test: {
        version: '0.7.0'
      }
    }
  },
  {
    runningId: '24be9663-e19b-4dd1-b606-8fa1a5094ba9',
    serviceName: 'Pay Request Editor',
    environments: {
      production: {
        version: '2.1.0'
      },
      perfTest: {
        version: '2.2.0'
      },
      development: {
        version: '2.3.0'
      },
      test: {
        version: '2.3.0'
      }
    }
  },
  {
    runningId: '24be9663-e19b-4dd1-b606-8fa1a5094ba0',
    serviceName: 'Waste Exemptions Back Office',
    environments: {
      production: {
        version: '4.9.1'
      },
      perfTest: {
        version: '4.8.0'
      },
      development: {
        version: '5.0.1'
      },
      test: {
        version: '5.0.0'
      }
    }
  }
]

module.exports = { runningServices }
