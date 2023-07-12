const deploymentsFixture = [
  {
    deploymentId: '553E4E6B-05D7-4A2E-BF80-02ED34DEF864',
    environment: 'Production',
    service: 'cdp-teams-and-repositories',
    version: '0.2.0',
    user: 'RoboCop',
    createdAt: '2023-05-18T21:54:12Z',
    updatedAt: '2023-05-18T21:54:12Z',
    status: 'RUNNING',
    dockerImage: 'amazonaws.com/cdp-teams-and-repositories:0.2.0'
  },
  {
    deploymentId: '6B163EB6-2444-4438-9C83-B85C9A8E4BC3',
    environment: 'PreProduction',
    service: 'cdp-teams-and-repositories',
    version: '0.2.0',
    user: 'Rodger Rabbit',
    createdAt: '2023-05-18T21:54:12Z',
    updatedAt: '2023-05-18T21:54:12Z',
    status: 'RUNNING',
    dockerImage: 'amazonaws.com/cdp-teams-and-repositories:0.2.0'
  },
  {
    deploymentId: 'D921920A-0411-4727-9354-4D1B3B3925FD',
    environment: 'Development',
    service: 'cdp-teams-and-repositories',
    version: '0.2.0',
    user: 'Tetsuo Shima',
    createdAt: '2023-05-18T21:54:12Z',
    updatedAt: '2023-05-18T21:54:12Z',
    status: 'RUNNING',
    dockerImage: 'amazonaws.com/cdp-teams-and-repositories:0.2.0'
  }
]

export { deploymentsFixture }
