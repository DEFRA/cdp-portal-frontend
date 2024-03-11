// Response from portalBackendApi/deployments

const undeploymentsFixture = {
  cdpDeploymentId: '3f5dff54-9bea-4a53-830d-96610af8c2b4',
  environment: 'infra-dev',
  service: 'cdp-portal-frontend',
  version: '0.217.0',
  user: {
    displayName: 'The Terminator',
    userId: '0ddadf17-beaf-4aef-a415-ca044dbdd18d'
  },
  created: '2024-01-17T18:46:36.171Z',
  updated: '2024-01-17T18:46:36.171Z',
  status: 'undeployed',
  dockerImage: 'cdp-portal-frontend',
  taskId: null,
  ecsSvcDeploymentId: null,
  cpu: null,
  memory: null,
  instanceTaskId: null,
  instanceCount: 0
}
export { undeploymentsFixture }
