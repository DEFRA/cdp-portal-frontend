const deploymentsFixture = [
  {
    deploymentId: '553E4E6B-05D7-4A2E-BF80-02ED34DEF864',
    environment: 'Production',
    service: 'cdp-teams-and-repositories',
    version: '0.2.0',
    user: 'RoboCop',
    deployedAt: '2023-05-18T22:54:12Z',
    status: 'RUNNING',
    dockerImage: 'amazonaws.com/cdp-teams-and-repositories:0.2.0',
    taskId: '5AA8E6FF-36EF-4D98-962E-0602AEA68B9D'
  },
  {
    deploymentId: '6B163EB6-2444-4438-9C83-B85C9A8E4BC3',
    environment: 'PreProduction',
    service: 'cdp-teams-and-repositories',
    version: '0.2.0',
    user: 'Roger Rabbit',
    deployedAt: '2023-05-18T19:54:12Z',
    status: 'RUNNING',
    dockerImage: 'amazonaws.com/cdp-teams-and-repositories:0.2.0',
    taskId: '59881058-5D07-44D8-BACF-25CDAD7D648F'
  },
  {
    deploymentId: 'D921920A-0411-4727-9354-4D1B3B3925FD',
    environment: 'Development',
    service: 'cdp-teams-and-repositories',
    version: '0.2.0',
    user: 'Tetsuo Shima',
    deployedAt: '2023-05-18T08:54:12Z',
    status: 'RUNNING',
    dockerImage: 'amazonaws.com/cdp-teams-and-repositories:0.2.0',
    taskId: 'D7CBF8C8-EDCC-4D74-9CE5-A713499CF9CC'
  },
  {
    deploymentId: '97DBF683-919B-4E12-B1C7-EF2EBA7516EB',
    environment: 'Development',
    service: 'cdp-portal-frontend',
    version: '0.2.0',
    user: 'Roger Rabbit',
    deployedAt: '2023-08-01T08:06:28Z',
    status: 'RUNNING',
    dockerImage:
      '111111111.dkr.ecr.us-west-2.amazonaws.com/cdp-portal-frontend:0.2.0',
    taskId: '4A7C4DB9-93C5-4A02-B6D3-BE2B8A196C8C'
  },
  {
    deploymentId: '422696B3-B87D-4EB9-9F3C-0B5FBAC95ADC',
    environment: 'Management',
    service: 'cdp-self-service-ops',
    version: '0.2.0',
    user: 'RoboCop',
    deployedAt: '2023-07-14T08:12:22Z',
    status: 'RUNNING',
    dockerImage:
      '111111111.dkr.ecr.us-west-2.amazonaws.com/cdp-self-service-ops:0.1.0',
    taskId: 'AB709A32-2448-463F-9023-AD53ABDFCB98'
  }
]

export { deploymentsFixture }
