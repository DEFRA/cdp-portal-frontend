// Response from selfServiceOpsApi/status/in-progress?kind=microservice
const inProgressStatusFixture = {
  message: 'success',
  inProgress: [
    {
      org: 'DEFRA',
      repositoryName: 'new-service-one',
      portalVersion: 2,
      kind: 'microservice',
      status: 'in-progress',
      userHasFinished: false,
      started: '2023-12-21T15:15:54.576Z',
      serviceTypeTemplate: 'cdp-node-backend-template',
      team: {
        teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
        name: 'Platform'
      },
      zone: 'protected',
      createRepository: {
        status: 'not-requested'
      },
      'cdp-tf-svc-infra': {
        status: 'not-requested'
      },
      'cdp-app-config': {
        status: 'not-requested'
      },
      'cdp-nginx-upstreams': {
        status: 'not-requested'
      }
    },
    {
      org: 'DEFRA',
      repositoryName: 'new-service-two',
      portalVersion: 2,
      kind: 'microservice',
      status: 'failure',
      userHasFinished: false,
      started: '2023-12-21T15:15:54.576Z',
      serviceTypeTemplate: 'cdp-node-backend-template',
      team: {
        teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
        name: 'Platform'
      },
      zone: 'protected',
      createRepository: {
        status: 'success'
      },
      'cdp-tf-svc-infra': {
        status: 'failure'
      },
      'cdp-app-config': {
        status: 'success'
      },
      'cdp-nginx-upstreams': {
        status: 'success'
      }
    }
  ]
}

export { inProgressStatusFixture }
