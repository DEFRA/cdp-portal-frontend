const joiValidationErrorDetailsFixture = [
  {
    message: 'Choose an entry',
    path: ['imageName'],
    type: 'any.only',
    context: {
      valids: [
        'cdp-node-frontend-template',
        'cdp-portal-frontend',
        'cdp-teams-and-repositories'
      ],
      label: 'imageName',
      value: '',
      key: 'imageName'
    }
  },
  {
    message: '"imageName" is not allowed to be empty',
    path: ['imageName'],
    type: 'string.empty',
    context: {
      label: 'imageName',
      value: '',
      key: 'imageName'
    }
  },
  {
    message: 'Choose an entry',
    path: ['version'],
    type: 'string.empty',
    context: {
      label: 'version',
      value: '',
      key: 'version'
    }
  },
  {
    message: 'Choose an entry',
    path: ['environment'],
    type: 'any.only',
    context: {
      valids: ['development', 'test', 'perftest', 'production'],
      label: 'environment',
      value: '',
      key: 'environment'
    }
  },
  {
    message: '"environment" is not allowed to be empty',
    path: ['environment'],
    type: 'string.empty',
    context: {
      label: 'environment',
      value: '',
      key: 'environment'
    }
  },
  {
    message: 'Environment is not available for this service',
    path: ['autoDeployEnvironments', 2],
    type: 'any.only',
    context: {
      valids: ['infra-dev', 'management', 'dev', 'test', 'perf-test'],
      label: 'autoDeployEnvironments[2]',
      value: 'snd',
      key: 2
    }
  }
]

export { joiValidationErrorDetailsFixture }
