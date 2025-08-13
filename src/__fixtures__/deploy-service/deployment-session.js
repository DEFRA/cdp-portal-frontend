const deploymentSessionFixture = {
  redirectLocation: '',
  imageName: 'cdp-portal-frontend',
  version: '0.8.0',
  environment: 'management',
  instanceCount: '4',
  cpu: '2048',
  memory: '9216'
}

const prototypeDeploymentSessionFixture = {
  redirectLocation: '',
  imageName: 'cdp-portal-prototype',
  version: '0.1.0',
  environment: 'dev',
  isPrototype: true
}

export { deploymentSessionFixture, prototypeDeploymentSessionFixture }
